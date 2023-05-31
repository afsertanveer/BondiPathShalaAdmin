import React from "react";

function ExamInfos({ name, course, subject }) {
  return (
    <div className="flex md:flex-wrap gap-4   justify-center">
      <span className="basis-1/2 grow text-center  p-5 mb-1 border border-border-color-4 bg-color-seven inline-block bg-co">
        Exam Name & Code: {name}
      </span>
      <span className="basis-1/2 grow text-center p-5 mb-1 border border-color-five bg-color-eight inline-block ">
        Course: {course}
      </span>
      <span className="basis-1/2 grow  text-center p-5 mb-1 border border-color-four bg-color-nine inline-block">
        Subject: {subject}
      </span>
    </div>
  );
}

export default ExamInfos;
