import Countdown, { zeroPad } from "react-countdown";

// Random component
const Completionist = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a complete state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <div className="flex space-x-6 justify-center items-center py-2">
        <div className="text-center">
          <div className="text-3xl">{zeroPad(hours)}</div>
          <div>Hours</div>
        </div>
        <div className="text-3xl font-bold">:</div>
        <div className="text-center">
          <div className="text-3xl">{zeroPad(minutes)}</div>
          <div>Minutes</div>
        </div>
        <div className="text-3xl font-bold">:</div>
        <div className="text-center">
          <div className="text-3xl">{zeroPad(seconds)}</div>
          <div>Seconds</div>
        </div>
      </div>
    );
  }
};
function CountDownTwo({ date, completedAction }) {
  return (
    <div>
      {/* count down */}
      <div className="">
        <Countdown date={Date.now() + date} renderer={renderer} />
      </div>
    </div>
  );
}

export default CountDownTwo;
