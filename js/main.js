// inputs
const inputMoeda1 = document.getElementById('moeda1');
const inputMoeda2 = document.getElementById('moeda2');
const convertedValue =  document.querySelector('[data-js="converted-value"]');
const valuePrecision = document.querySelector('[data-js="converted-precision"]');
const timesCurrencyOne = document.querySelector('[data-js="currency-one-times"]');
const buttonConvert = document.querySelector('[data-js="button-convert"]');
const convertionResult = document.querySelector('[data-js="convert-result"]');

const state = (() => {
    let exchangeRate = {};
    return {
        getExchangeRate: () => exchangeRate,
        setExchangeRate: newExchangeRate => {
            if (!newExchangeRate.conversion_rates) {
                alert('O objeto precisa ter uma propriedade convertion_rates')
                return
            }
            
            exchangeRate = newExchangeRate
            return exchangeRate
        }
    }
})()

// declaração URL API
const APIKey = 'be33deaef0d624c3e65c655c';
const getUrl = currency =>
    `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${currency}`;

const getErrormessage = errorType => ({
    'unsupported-code': 'A moeda não existe em nosso banco de dados.',
    'base-code-only-on-pro': 'Informações de moedas que não sejam USD ou EUR só podem ser acessadas',
    'malformed-request': 'O endpoint do seu request precisa seguir a estrutura à seguir',
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
            const errorMessage = getErrormessage(exchangeRateData['error-type']);
            throw new Error(errorMessage);
        }

        return state.setExchangeRate(exchangeRateData)
        
    } catch (err) {
        alert(err.message);
    }

}

const getOptions = (selectedCurrency, conversion_rates) => {
    const setSelectedAttribute = moedas =>
        moedas === selectedCurrency ? 'selected' : '';
    const getOptionsAsArray = moedas =>
        `<option ${setSelectedAttribute(moedas)}>${moedas}</option>`;

    return Object.keys(conversion_rates)
        .map(getOptionsAsArray)
        .join('');
}

const getMultipliedExchangeRate = (conversion_rates) => {
    const currencyTwo = conversion_rates[inputMoeda2.value]
    return (timesCurrencyOne.value * currencyTwo).toFixed(2);
}

const getNotRoundedExchangeRate = (conversion_rates) => {
    const currencyTwo = conversion_rates[inputMoeda2.value];
    return `1 ${inputMoeda1.value} = ${1 * currencyTwo} ${inputMoeda2.value}`;
}

const showUpdatedRates = ({ conversion_rates }) => {
    valuePrecision.textContent = getNotRoundedExchangeRate(conversion_rates);
}

const showInitialInfo = ({ conversion_rates }) => {
    inputMoeda2.innerHTML = getOptions('USD', conversion_rates)
    inputMoeda1.innerHTML = getOptions('BRL', conversion_rates)

    showUpdatedRates({ conversion_rates })
}

const init = async () => {
    const url = getUrl('BRL');
    const exchangeRate = await fetchExchangeRate(url);

    if (exchangeRate && exchangeRate.conversion_rates) {
        showInitialInfo(exchangeRate);
    }
}

timesCurrencyOne.addEventListener('input', () => {
    if (timesCurrencyOne.value <= 0) {
        timesCurrencyOne.value = 1;
    }
})

const handleCurrencyOneValueToConvert = () => {
    const { conversion_rates } = state.getExchangeRate();

    convertionResult.textContent = getMultipliedExchangeRate(conversion_rates);
}

const handleCurrencyTwoInput = () => {
    const exchangeRate = state.getExchangeRate()
    showUpdatedRates(exchangeRate)
}

const handleCurrencyOneInput = async (e) => {
    const url = getUrl(e.target.value);
    const exchangeRate = await fetchExchangeRate(url);
    
    showUpdatedRates(exchangeRate);
}
    
buttonConvert.addEventListener('click', handleCurrencyOneValueToConvert);
inputMoeda2.addEventListener('input', handleCurrencyTwoInput);
inputMoeda1.addEventListener('input', handleCurrencyOneInput);

init()