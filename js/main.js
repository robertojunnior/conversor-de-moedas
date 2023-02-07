// declaração URL API
const getUrl = currency => `https://v6.exchangerate-api.com/v6/be33deaef0d624c3e65c655c/latest/${currency}`;
// inputs
const inputMoeda1 = document.getElementById('moeda1');
const inputMoeda2 = document.getElementById('moeda2');
const convertedValue =  document.querySelector('[data-js="converted-value"]');
const valuePrecision = document.querySelector('[data-js="converted-precision"]');
const timesCurrencyOne = document.querySelector('[data-js="currency-one-times"]');
const buttonConvert = document.querySelector('[data-js="button-convert"]');
const convertionResult = document.querySelector('[data-js="convert-result"]');

let internalExchangeRate = {};

const getErrormessage = errorType => ({
    'unsupported-code': 'A moeda não existe em nosso banco de dados.',
    'base-code-only-on-pro': 'Informações de moedas que não sejam USD ou EUR só podem ser acessadas',
    'malformed-quest': 'O endpoint do seu request precisa seguir a estrutura à seguir',
    'invalid-key': 'A chave da API não é válida',
    'quota-reached': 'Sua conta alcançou o limite de requests permmitido em seu plano atual',
    'not-available-on-plan': 'Seu plano atual não permite este tipo de request'
})[errorType] || 'Não foi possível obter as informações.'

const fetchExchangeRate = async (url) => {
    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error('Sua conexão falhou. Não foi possível obter as informações.')
        }

        const exchangeRateData = await response.json();

        if (exchangeRateData === 'error'){
            throw new Error(getErrormessage(exchangeRateData['error-type']))
        }

        return exchangeRateData
        
    } catch (err) {
        alert(err.message);
    }

}

const showInitialInfo = () => {
    const getOptions = selectedCurrency => Object.keys(internalExchangeRate.conversion_rates)
    .map(moedas => `<option ${moedas === selectedCurrency ? 'selected' : ''}>${moedas}</option>`)
    .join('');

inputMoeda1.innerHTML = getOptions('USD')
inputMoeda2.innerHTML = getOptions('BRL')

//convertedValue.textContent = internalExchangeRate.conversion_rates.BRL.toFixed(2);
valuePrecision.textContent = `1 USD = ${internalExchangeRate.conversion_rates.BRL} BRL`
}

const init = async () => {

    internalExchangeRate = { ...(await fetchExchangeRate(getUrl('USD'))) }

    if (internalExchangeRate.conversion_rates) {
        showInitialInfo();
    }
}

const showUpdatedRates = () => {
    valuePrecision.textContent = `1 ${inputMoeda1.value} = ${1 * internalExchangeRate.conversion_rates[inputMoeda2.value]} ${inputMoeda2.value}`;
}

timesCurrencyOne.addEventListener('input', () => {
    if (timesCurrencyOne.value <= 0) {
        timesCurrencyOne.value = 1;
    }
})

buttonConvert.addEventListener('click', () => {
    convertionResult.textContent = (timesCurrencyOne.value * internalExchangeRate.conversion_rates[inputMoeda2.value]).toFixed(2);
})

inputMoeda2.addEventListener('input', showUpdatedRates)

inputMoeda1.addEventListener('input', async (e) => {
    internalExchangeRate = { ...(await fetchExchangeRate(getUrl(e.target.value))) };
    showUpdatedRates();
})

init()