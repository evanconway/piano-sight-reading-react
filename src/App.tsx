import Midi from "./components/Midi";
import MidiSupport from "./components/MidiSupport";
import Options from "./components/options/Options";
import Score from "./components/Score";

function App() {
	return (<>
		<Options/>
		<Midi/>
		<Score/>
		<MidiSupport/>
	</>);
}

export default App;
