import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function GetData({ markdown }) {
    console.log("check",markdown);
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}