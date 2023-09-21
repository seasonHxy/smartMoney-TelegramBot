
const aircode = require('aircode');
const bignumber = require('bignumber.js');
const TelegramBot = require('node-telegram-bot-api');

const usdt_address = '0xdAC17F958D2ee523a2206206994597C13D831ec7'.toLowerCase();
const usdc_address = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'.toLowerCase();

const token = 'YOUR-TELEGRAM-TOKEN'
const bot = new TelegramBot(token, {
  polling: true
})

const symbolMap = new Map();
symbolMap.set(usdc_address, 'USDC');
symbolMap.set(usdt_address, 'USDT');

module.exports = async function (params, context) {
  console.log(params);
  let data = params.data;

  let value = new bignumber.BigNumber(data.value);
  let symbol = symbolMap.get(data.contract_address.toLowerCase());

  if (symbol === undefined || symbol === null) {
    return {};
  }

  if (symbol === 'USDT' && value.lt(new bignumber.BigNumber(1000000000000000))) {
    return {};
  }

  if (symbol === 'USDC' && value.lt(new bignumber.BigNumber(100000000000000000000))) {
    return {};
  }

  let msg = {
      "block": data.block_number,
      "transaction_hash": data.transaction_hash,
      "from_address": data.from_address,
      "to_address": data.to_address,
      "value": data.value,
      "symbol": symbol,
  }
  
  try {
    await bot.sendMessage('YOUR-TELEGRAM-CHAT-ID', JSON.stringify(msg));
  } catch (e) {
    console.log(e);
  }

  return {
    msg,
  };
};
