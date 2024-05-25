import clock from "clock";
import * as document from "document";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";

// HEART RATE
const heartRate = document.getElementById("heart-rate");
const heartPulseInstance = document.getElementById("heart-pulse-instance");

// Display heart rate
const hrm = new HeartRateSensor();
hrm.addEventListener("reading", () => {
  heartRate.textContent = hrm.heartRate;
});

// Define start and stop functions for hrm and heart pulse animation
function startHrm() {
  hrm.start();
  heartPulseInstance.animate("enable");
}

function stopHrm() {
  hrm.stop();
  heartPulseInstance.animate("disable");
}

// Check if watch is on wrist and start hrm
if (BodyPresenceSensor) {
  const body = new BodyPresenceSensor();
  body.addEventListener("reading", () => {
    if (!body.present) {
      stopHrm();
    } else {
      startHrm();
    }
  });
  body.start();
}

// Automatically stop the sensor when the screen is off to conserve battery
display.addEventListener("change", () => {
  display.on ? startHrm() : stopHrm();
});

// CLOCK

// Tick every second
clock.granularity = "seconds";

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

// Rotate the hands every tick
function updateClock() {
  let today = new Date();
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();
  let secs = today.getSeconds();

  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
}

// Update the clock every tick event
clock.addEventListener("tick", updateClock);
