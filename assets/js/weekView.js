let habitEvents = $('.calendar').data('habits');
console.log('habitsData1',habitEvents);

// Get references to calendar elements
const currentWeekElement = document.getElementById('currentWeek');
const calendarGridElement = document.querySelector('.calendar-body');
const prevWeekButton = document.getElementById('prevWeek');
const nextWeekButton = document.getElementById('nextWeek');

// Initialize the calendar with the current week
let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds to 0
renderCalendar(currentDate);
// scrollToCurrentDate();


// Event listeners for navigating between weeks
prevWeekButton.addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
    const prevWeekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);    
    renderCalendar(currentDate);
});

nextWeekButton.addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
    renderCalendar(currentDate);
});

// Function to render the calendar for a given week
function renderCalendar(date) {
    
    // Calculate the first day of the week (Sunday) for the given date
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - date.getDay());

    currentWeekElement.textContent = `Week of ${getFormattedWeek(date)}`;

    // Clear previous week's cells
    calendarGridElement.innerHTML = '';
    
    habitEvents.forEach((habit)=>{ 
        const h4 = document.createElement('h4')
        h4.textContent = habit.habitName
        h4.id = `heading-${habit._id}`
        // calendarGridElement.parentNode.insertBefore(h4, calendarGridElement);
        let parentDiv = document.createElement('div')
        parentDiv.className = 'gridParent'
        parentDiv.id = `parent-${habit._id}`
        for (let i = 0; i < 7; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            
            const day = new Date(firstDayOfWeek);
            day.setDate(firstDayOfWeek.getDate() + i);
    
            // Format the date in 'YYYY-MM-DD' format for comparison
            const formattedDate = getFormattedDate(day);
            cell.textContent = day.getDate();
            cell.setAttribute('data-date', formattedDate);
            if (isToday(day)) {
                cell.classList.add('today');
                cell.classList.add('selected'); // Automatically select today's date
            }
            parentDiv.appendChild(cell);
            console.log('todays date',getFormattedDate(new Date()))
            let todaysDate = getFormattedDate(new Date())
            console.log('habitstartdate',habit.start_date)
            console.log('formattedDate',formattedDate)
            let start_date = getFormattedDate(new Date(habit.start_date))
            console.log('start_date',start_date)
            if(start_date<=formattedDate  && formattedDate<=todaysDate){
                console.log('im true')
                $.ajax({
                    type:'get',
                    url:'/api/v1/users/habit/getStatus',
                    data:{
                        completion_date:formattedDate,
                        habit:habit
                    },
                    success:function(data){
                        if(data.data.habit.length>0){
                            if(data.data.habit[0].status=='done'){
                                let i = document.createElement('i')
                                i.className = 'correctIcon fa fa-solid fa-check'
                                const lineBreak = document.createElement('br');
                                cell.appendChild(lineBreak);
                                cell.appendChild(i)
                            }else{
                                let i = document.createElement('i')
                                i.className = 'wrongIcon fa fa-solid fa-xmark'
                                const lineBreak = document.createElement('br');
                                cell.appendChild(lineBreak);
                                cell.appendChild(i)
                            }
                        }else{
                            let img = document.createElement('img')
                            img.className = 'statusImage'
                            const lineBreak = document.createElement('br');
                            cell.appendChild(lineBreak);
                            img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/ProhibitionSign2.svg/300px-ProhibitionSign2.svg.png"
                            cell.appendChild(img)
                        }  
                    }
                })
            } 
        }
        calendarGridElement.appendChild(parentDiv)
        parentDiv.parentNode.insertBefore(h4, parentDiv);
        // Create a new button element
        const deleteButton = document.createElement('button');
        deleteButton.className = "DeleteBtn"
        deleteButton.textContent = 'Delete'; // Set the button text content
        // Append the button to the calendarGridElement
        deleteButton.id = `delete-${habit._id}`
        deleteButton.addEventListener('click',deleteHabit)
        calendarGridElement.appendChild(deleteButton);
    }) 
}

function deleteHabit(event){
    console.log('delete click buttton')
    console.log('event',event.target.id)
    let id = event.target.id.slice(7)
    console.log('id',id)
    $.ajax({
        type:'delete',
        url:'/api/v1/users/habit/delete',
        data:{
            habit_id:id
        },
        success:function(data){
           console.log('data',data)
           console.log('parent',$(`parent-${id}`))
           console.log('delete',$(`delete-${id}`))
           console.log('heading',$(`heading-${id}`))
           $(`#parent-${id}`).remove()
           $(`#delete-${id}`).remove()
           $(`#heading-${id}`).remove()
        },
        error:function(error){
            console.log('error',error)
        }
    })
}

// Helper function to format a date in 'YYYY-MM-DD' format
function getFormattedDate(date) {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// Helper function to get the formatted week for display
function getFormattedWeek(date) {
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const startMonth = weekStart.toLocaleString('en-IN', { month: 'short' });
    const endMonth = weekEnd.toLocaleString('en-IN', { month: 'short' });
    if(startMonth==endMonth){
        return `${startMonth} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
    }else{
        return `${startMonth} ${weekStart.getDate()} - ${endMonth} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
    }
}

// Helper function to check if a date is today
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}