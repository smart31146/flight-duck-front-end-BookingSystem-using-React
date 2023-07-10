import React , {useEffect, useRef, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setGlobalState, useGlobalState } from '../../index'
import './calenderStyle.css'

const CustomDatePicker = () => {

  const [lastValue, setLastValue] = useState([])
  const calendarPrices = localStorage.getItem("calendarPrices");
  const [isLocal] = useGlobalState("isLocal")
  let [calendarUpdate] = useGlobalState("calendarPrices")

  useEffect(()=>{
    console.log("calendarPrices in calendar object",calendarPrices)

    async function fetchData() {
      if(!isLocal) {
        if (localStorage.getItem("calendarPrices")) {
          if (calendar.length > 0) {
            console.log("not sure how")
            const calendar = JSON.parse(localStorage.getItem("calendarPrices"));

            calendar.map((item, index) => {
              var temp = lastValue;
              temp.push(item);
              setLastValue(temp);
            });
          }
        }

      } else {
        const response = await fetch('/cachePackageResponse.json');
        const json = await response.json();
        const keys = Object.keys(json.list);
        const lastKey = keys.slice(-1)[0];
        console.log("json", json.list)
        console.log("testlastkey", json.list[lastKey].calendar)
        const {calendar} = json.list[lastKey]

        calendar.map((item, index) => {

          var temp = lastValue
          temp.push(item)
          setLastValue(temp)
        })
        // const tt=JSON.parse(json.list[lastKey].calendar)

        // json.list[lastKey].calendar.map((item)=>{
        //   console.log('item',item)
        // })
      }


    }

    fetchData();



  },[calendarUpdate])
  // useEffect(()=>{
  //   console.log("testlast", lastValue)
  // })
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log("currentMonth",date.getMonth()); // get the selected month
  };
  const filterDate = (date) => {
    return date.getMonth() === selectedDate?.getMonth(); // display only dates of the selected month
  };
  // const renderDayContents = (day, date) => {
  //   calendar = [
  //     {
  //         "date": "2023-09-11",
  //         "price": 901.89,
  //         "color": "red"
  //     },
  //     {
  //         "date": "2023-09-12",
  //         "price": 772.1,
  //         "color": "red"
  //     }]
  //   return (<>


  //            {day === 21 ? <span className="event">{day}</span> : <span>{day}</span>}
  //          </>);
  // };
  const [startDate, setStartDate] = useState(new Date());


  const today = new Date();
  const startOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const endOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
  const handleMonthChange = (date) => {

    setStartDate(date);
  };

  let calendar = localStorage.getItem("calendarPrices");

  let dateObj = new Date();

  if (calendar) {
    console.log("calender", calendar)
    // Parse it into an array
    calendar = JSON.parse(calendar);

    // Check if the calendar array is not empty
    if (calendar.length > 0) {
      // Get the date string of the first item in the array
      let dateString = calendar[0].date;

      // Convert it into a Date object
      dateObj = new Date(dateString);
    }
  }




  const renderDay = (day, date) => {
    // console.log("currentMonth",date.getMonth())
    // lastValue.map((item)=>{
    //   console.log("lastitem",item.date)
    // })
    // const eventDates = [new Date(lastValue[0].date), new Date(lastValue[1].date)]; // Example specific dates

      var pan=0
      for(var i=0;i<lastValue.length;i++){
        const eventDate = new Date(lastValue[i].date)


        if (date.getFullYear() == eventDate.getFullYear() && date.getMonth() == eventDate.getMonth() && date.getDate() == eventDate.getDate() && day>=10) {


          return (
            <>

              { lastValue[i].color=='red' ? <span className="normal red">{eventDate.getDate()}</span> : lastValue[i].color=='green' ? <span className="normal green">{date.getDate()}</span> : <span className="normal yellow">{date.getDate()}</span>}
              <div className="hidden">
                  {lastValue[i].price}
              </div>
              </>
          );
        }
        if (date.getFullYear() == eventDate.getFullYear() && date.getMonth() == eventDate.getMonth() && date.getDate() == eventDate.getDate() && day<10) {

          return (
            <>

              { lastValue[i].color=='red' ? <span className="double red">{date.getDate()}</span> : lastValue[i].color=='green' ? <span className="double green">{date.getDate()}</span> : <span className="double yellow">{date.getDate()}</span>}
              <div className="hidden">
                  {lastValue[i].price}
              </div>
              </>
          );
        }
      }



    if (day>=10) {
      return (
        <>
          <span className="normal yellow">{date.getDate()}</span>

        </>
      )
    }
    if (day<10) {
      return <span className="double yellow">{date.getDate()}</span>
    }
    // if(!date.getMonth() === startDate.getMonth()) return null
  };
  return (
    <DatePicker
      selected={dateObj}
      // onChange={(date) => setStartDate(date)}

      showPopperArrow={false}
      showDayMonthPicker
      // showMonthYearPicker
      // showFullMonthYearPicker
      inline
      // fixedHeight
      // shouldCloseOnSelect={false}
      onMonthChange={handleMonthChange}
      // disabled={true}
      renderDayContents={renderDay} // you can use this prop
      // filterDate={filterDate}
    />
  );
};

export default CustomDatePicker