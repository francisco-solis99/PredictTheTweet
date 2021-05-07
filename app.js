import { data } from './data.js';
console.log(data);

// get DOM elements
const sample = document.getElementById('sampleText');
const button = document.getElementById('executePrediction');
const result = document.getElementById('result');
const image = document.getElementById('profileImage');
const container = document.getElementById('WrapperResult');
const clear = document.getElementById('clear');
let counter = 0;


button.addEventListener('click', executePrediction);
clear.addEventListener('click', () => {
    sample.value = '';
    container.classList.remove('predict__result-on');
});



function executePrediction() {
    // validate if is something is on the input text
    if (!sample.value) {
        console.log('Write something to evaluate and predict');
        alert('Write something to evaluate and predict');
    } else {
        if (counter === 0) {
            trainingProccess();
        }
        predictSample(sample.value);

    }
    counter += 1;

}

let netTrained;
// config of neural net


const encode = (string) => {
    let asciiString = string.split('').map(element => element.charCodeAt(0) / 256);
    return asciiString;
}

const getValidateData = (dataToGet) => {
    return dataToGet.map(element => {
        return {
            input: encode(element.input),
            output: element.output
        }
    });
}

function trainingProccess() {
    const config = {
        // inputSize: 20,
        // inputRange: 20,
        // outputSize: 20,
        hiddenLayers: [3],
        learningRate: 0.3,
        decayRate: 0.999,
        iterations: 20000,
        log: false,
        timeout: Infinity,
        activation: 'sigmoid'
    }

    const net = new brain.NeuralNetwork(config);
    console.log(getValidateData(data));
    net.train(getValidateData(data));
    netTrained = net.toFunction();
}

function predictSample(input) {
    console.log(input);
    let output, probability = 0,
        src;
    let result = netTrained(encode(input));
    console.log(result);

    if (result.trump > result.kardashian) {
        output = 'Donald Trump';
        probability = Math.floor(result.trump * 100);
        src = 'https://pbs.twimg.com/profile_images/1266414222109544453/1EVuI99d_400x400.jpg'; //or link to twitter image picture
    } else {
        output = 'Kim Kardashian';
        probability = Math.floor(result.kardashian * 100);
        src = 'https://pbs.twimg.com/profile_images/1282057272357683201/hm0ianWU_400x400.jpg'; //or link to twitter image picture
    }
    console.log(output);
    console.log(probability);

    showResult(output, probability, src);

}


function showResult(output, probability, src) {
    container.classList.add('predict__result-on');
    result.innerHTML = `It seems there is a probability of ${probability}% that tweet comes from ${output}`;
    image.src = src;
}


// probe
// Whether we are Republican or Democrat, we must now focus on strengthening Background Checks!
// These aren't real. Kanye would never write Yeezy on the side'

// https://brain.js.org/#/
//https://github.com/BrainJS/brain.js#brainjs