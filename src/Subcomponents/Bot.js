import React, {useState} from 'react';

import { Configuration, OpenAIApi } from "openai";

export default function Bot(props) {

    const SOLARbot = `
        You will play the role of SOLARbot.
        SOLARbot is an assistant for a electron/react hybrid application for the design team UBC SOLAR. 
        UBC SOLAR is a design team at the University of British Columbia that is building a solar powered car to compete in the american solar challenge.
        This application is the front-end interface with a simulation, which factors in race conditions and uses information about the car to create a race strategy.
        This application uses data from the car, weather conditions, route conditions, and other factors.
        The goal is for the to complete the race in the shortest amount of time possible without running out of battery.

        Here is the error documentation for this application with more information and troubleshooting tips:

        Description:
        The application pulls telemetry data from a database and allows the user to manually prompt the simulation to recalculate as needed.
        It uses hidden windows to launch Python sub-processes where simulation data is calculated.

        Error Documentation/Troubleshooting:

        Problem: Simulation results not displaying on Windows device after integrating the simulation package into the local directory. Error occurs.
        Fix: Run the terminal as administrator.
        Windows: Something is already running on port 3000:
        Problem: Sometimes, after force killing the app, it does not properly kill and free up port 3000.
        Fix: Run the command npx kill-port 3000 to clear the port before running the app again.
        If the simulation isn't running without any clear source of error, check the pythonPath in the configuration. Ensure it points to the correct Python installation (e.g., py, python3).
        

        Problem: Application boots up but simulation run never completes.
        Possible Solutions: Python Virual environment may not be set up correctly.

        Python Virtual Environment Setup Instructions:
        Navigate to the project directory (likely named Simulation-Client).
        Create a new python virtual environment:
        Copy code
        python3 -m venv venv
        Activate the virtual environment:
        For UNIX or MacOS:
        bash
        Copy code
        source venv/bin/activate
        For Windows:

        Copy code
        .\venv\Scripts\activate
        Install the dependencies:
        Copy code
        pip install -r requirements.txt
        Once these steps are completed, your virtual environment will be set up and ready to use. Look for "(venv)" before your prompt in the terminal to verify that the virtual environment is active.
    `

    const configuration = new Configuration({
        apiKey: process.env.REACT_APP_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    

    // const SOLARbot = `
    //     You will play the role of Mean Madeline
    //     Madeline is really mean and does anything in their power to hurt the feelings of the user
    //     Madeline loves to eat squash
    //     If you say the word poop Madeline yells with Terror like this "ARGHHHHHHH"
    // `

    const [messages, setMesssages] = useState([
        {"role": "system", "content": SOLARbot},
    ]);
    const [userInput, setUserInput] = useState('');

    async function onSubmit(event) {
        event.preventDefault();
        try {
          let newMess = messages;
          let newBotMess = [{"role": "system", "content": SOLARbot}];
          newMess.push({"role": "user", "content": userInput},);
          newBotMess.push({"role": "user", "content": userInput},)

          const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            temperature: 0.3, 
            messages: newBotMess,
            presence_penalty: 0.6,
          });
    
          const data = completion.data.choices[0].message.content;;
          newMess.push({"role": "assistant", "content": data},);
          setMesssages(newMess);
          setUserInput("");
        } catch(error) {
          if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
          } else {
            console.log(error.message);
          }
        }
      }

    const generateList = () => {
        return messages.map((element, key) => {
          if(element.role !== "system"){
            return(
              <li key={key} className="botListItem">
                <div className="">{element.role === "user" ? "You:" : "BOT:"}</div>
                <div>{element.content}</div>
              </li>
            );
          }
          
        })
    }
    
    return(
        <div>
            <ul className="botUnorderedList">
                {generateList()}
            </ul>
        <form onSubmit={onSubmit}>
        <input
          type="text"
          name="animal"
          placeholder="Type"
          className="botInputText"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <br/>
      </form></div>
    )
}