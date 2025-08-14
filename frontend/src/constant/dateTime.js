const dateTime = (time)=>{
  const date = new Date(time);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

export const onlyDate=(time)=>{
  const date = new Date(time)
  return date.toLocaleDateString()
}

export default dateTime