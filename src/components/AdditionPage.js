import React, { useState } from 'react';

const AdditionPage = () => {
  // State variables to manage input for two numbers and the result
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [result, setResult] = useState('');
  const [serverResult, setServerResult] = useState('');

  // Function to handle input change for number1
  const handleNumber1Change = (event) => {
    setNumber1(event.target.value);
  };

  // Function to handle input change for number2
  const handleNumber2Change = (event) => {
    setNumber2(event.target.value);
  };

  // Function to handle addition
  const handleAddition = async () => {
    // Convert input values to numbers and perform addition
    const num1 = parseFloat(number1);
    const num2 = parseFloat(number2);
    const sum = num1 + num2;
    // Update the result state
    setResult(sum);

    try {
      // Send request to backend
      const response = await fetch('http://ec2-18-227-13-56.us-east-2.compute.amazonaws.com:5006/api/addition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          num1: parseFloat(number1),
          num2: parseFloat(number2)
        })
      });
  
      // if (!response.ok) {
      //   throw new Error('Failed to add numbers');
      // }
  
      // Parse response from backend
      const data = await response.json();
      console.log(data);
      const serverResult = data.result;
  
      // Update state with both frontend and backend results
      setServerResult(serverResult);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{height:"100vh", width:"100vw"}}>
      <div className='w-100 border border-1 rounded shadow-lg py-5 bg-light'> 
        <h1 className="text-center mb-4">Addition Page</h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="number1">Number 1:</label>
              <input
                type="number"
                className="form-control border border-black"
                id="number1"
                value={number1}
                onChange={handleNumber1Change}
              />
            </div>
            <div className="form-group">
              <label htmlFor="number2">Number 2:</label>
              <input
                type="number"
                className="form-control border border-black"
                id="number2"
                value={number2}
                onChange={handleNumber2Change}
              />
            </div>
            <button type="button" className="btn btn-primary mt-4" onClick={handleAddition}>Add</button>
            {result && <div className="mt-3">Result: {result}</div>}
            {serverResult && <div className="mt-3">Server Result: {serverResult}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionPage;
