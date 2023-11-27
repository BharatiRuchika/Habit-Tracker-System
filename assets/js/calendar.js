let habitEvents = $('.calendar').data('habits');
console.log('habitsData1',habitEvents);

 // Function to scroll to the cell representing the current data
function scrollToCurrentDate() {
    console.log('im in scrollToCurrentDate')
    
    // Find the cell representing the current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds to 0

    const day = currentDate.getDate();

    // Get all the calendar cells (excluding header cells)
    const cells = document.querySelectorAll('.calendar-cell:not(.calendar-header)');
    for (const cell of cells) {
        if (parseInt(cell.textContent) === day) {
            
            // Scroll to the current cell
            cell.scrollIntoView({ behavior: 'smooth' });
            const selectedDate = new Date(currentDate);
            selectedDate.setDate(parseInt(cell.textContent));

            // Display habits for the selected date
            displayHabitsForDate(selectedDate);
            break; // Stop searching once the cell is found
        }
    }
}

// Get references to calendar elements
const currentWeekElement = document.getElementById('currentWeek');
const calendarGridElement = document.querySelector('.calendar-grid');
const prevWeekButton = document.getElementById('prevWeek');
const nextWeekButton = document.getElementById('nextWeek');

// Initialize the calendar with the current week
let currentDate = new Date();
console.log('currentDate',currentDate)
currentDate.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds to 0
renderCalendar(currentDate);
scrollToCurrentDate();

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
    console.log('im in render calendar')
    // Calculate the first day of the week (Sunday) for the given date
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - date.getDay());
    currentWeekElement.textContent = `Week of ${getFormattedWeek(date)}`;

    // Clear previous week's cells
    calendarGridElement.innerHTML = '';

    // Create cells for the days of the week
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
        calendarGridElement.appendChild(cell);
    }
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


// Add an event listener to the calendar grid for cell selection
calendarGridElement.addEventListener('click', function (event) {
    const selectedCell = event.target;
   
    // Check if a cell is clicked
    if (selectedCell.classList.contains('calendar-cell')) {
    
        // Remove the 'selected' class from any previously selected cell
        const selectedCells = document.querySelectorAll('.calendar-cell.selected');
        selectedCells.forEach(cell => cell.classList.remove('selected'));

        // Add the 'selected' class to the clicked cell
        selectedCell.classList.add('selected');
        const formattedDate = selectedCell.getAttribute('data-date');
        // Check if the selected day is greater than the number of days in the current month

        displayHabitsForDate(formattedDate);
    }
});

// Function to display habits for a specific date
function displayHabitsForDate(date) {

    // Clear the habit list
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = '';

    // Format the date in 'YYYY-MM-DD' format for comparison
    // const formattedDate = getFormattedDate(date);
   
    // Filter habit events for the selected date
    const habitsForDate = habitEvents.filter((event) => {
        const eventDate = new Date(event.start_date);
        const fDate = new Date(date)
        eventDate.setHours(0, 0, 0, 0);
        fDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() <= fDate.getTime()
    });
    
    if (habitsForDate.length === 0) {
        const noHabitsMessage = document.createElement('li');
        noHabitsMessage.textContent = 'Nothing scheduled for this day.';
        habitList.appendChild(noHabitsMessage);
    } else {
        
        // Display the habits for the selected date
        habitsForDate.forEach((habit,index) => {
            const today = new Date();
            const habitItem = document.createElement('li');

             // Create a label for the checkbox
             const label = document.createElement('label');
             label.classList.add('list')
             label.textContent = habit.habitName;
             const date1 = new Date(date);
            if(date==habit.start_date){
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = date1;
                checkbox.addEventListener('click', function(event){
                    handleCheckboxChange(event,habit)
                });
                habitItem.appendChild(checkbox);
                checkbox.parentElement.setAttribute('data-original-position', index);
            }else{
                const date1 = new Date(date); // Replace this with your first date
                const date2 = new Date(today); // Replace this with your second date
                if(date1<date2){
                    
                    // Calculate the difference in milliseconds
                    const timeDifference = date2.getTime()-date1.getTime();
                    console.log('timeDifference',timeDifference)
                    
                    // Calculate the number of milliseconds in 7 days
                   const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
                if(timeDifference<=0){
                    label.style.backgroundColor = 'gray'
                    label.style.color = 'lightgray'
                    let completion_date = getFormattedDate(date1)
                    $.ajax({
                        type:'get',
                        url:'/api/v1/users/habit/getStatus',
                        data:{
                            completion_date:completion_date,
                            habit:habit
                        },
                        success:function(data){
                            if(data.data.habit.length>0){
                                if(data.data.habit[0].status=='done'){
                                    const newContent = document.createElement('span');
                                    newContent.textContent = 'finished';
                                    const lineBreak = document.createElement('br');
                                    label.appendChild(lineBreak);
                                    label.appendChild(newContent);
                                }else{
                                    const newContent = document.createElement('span');
                                    newContent.textContent = 'missed';
                                    const lineBreak = document.createElement('br');
                                    label.appendChild(lineBreak);
                                    label.appendChild(newContent);
                                }
                            }
                        }
                    })
                }else
                   
                // Check if the difference is exactly 7 days
                if (timeDifference < sevenDaysInMilliseconds) {
                    
                    // The dates are exactly 7 days apart
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = date1;
                        checkbox.addEventListener('click', function(event){
                            handleCheckboxChange(event,habit)
                        });
                        habitItem.appendChild(checkbox);
                        checkbox.parentElement.setAttribute('data-original-position', index);
                        let completion_date = getFormattedDate(date1)
                        $.ajax({
                            type:'get',
                            url:'/api/v1/users/habit/getStatus',
                            data:{
                                completion_date:completion_date,
                                habit:habit
                            },
                            success:function(data){
                                
                                // Display a success message and redirect to the home page
                                if(data.data.habit.length>0){
                                    if(data.data.habit[0].status=='done'){
                                        label.style.backgroundColor = 'gray'
                                        label.style.color = 'lightgray'
                                        const newContent = document.createElement('span');
                                        newContent.textContent = 'finished';
                                        const lineBreak = document.createElement('br');
                                        label.appendChild(lineBreak);
                                        label.appendChild(newContent);
                                        checkbox.checked = true;
                                    }else{
                                        const thirdChild = label.childNodes[2];
                                        console.log('thirdChild',thirdChild)
                                        if (thirdChild && thirdChild.nodeName === 'SPAN') {
                                            
                                            // Remove the line break
                                            label.removeChild(thirdChild);
                                        }
                                       
                                        // Check if there is a span as the second child
                                        const secondChild = label.childNodes[1];
                                        if (secondChild && secondChild.nodeName === 'BR') {
                                            // Remove the span
                                            label.removeChild(secondChild);
                                        } 
                                        label.style.backgroundColor = '#007BFF'
                                        label.style.color = 'white'
                                        checkbox.checked = false;
                                    }
                                }
                            },error:function(error){
                                console.log(error.responseText)
                            }
                        })
                    }
                }
            }
            habitItem.appendChild(label);
            habitList.appendChild(habitItem);
        });
    }
}


// Function to handle checkbox change event
function handleCheckboxChange(event,habit) {
    let status = ''
    const checkbox = event.target;
    const habitItem = checkbox.parentElement;
    const habitList = document.getElementById('habitList');
    const label = habitItem.querySelector('label');

    // Check if the checkbox is checked
    if (checkbox.checked) {
        status = 'done'
        // Move the checked habit item to the bottom of the list
        habitList.appendChild(habitItem);
        label.style.backgroundColor = 'gray'
        label.style.color = 'lightgray'
        const newContent = document.createElement('span');
        newContent.textContent = 'finished';
        const lineBreak = document.createElement('br');
      
        // Append the line break to the label
        label.appendChild(lineBreak);
        label.appendChild(newContent);
    } else {
        status='not done'
        const thirdChild = label.childNodes[2];
        console.log('thirdChild',thirdChild)
        if (thirdChild && thirdChild.nodeName === 'SPAN') {
            // Remove the line break
            label.removeChild(thirdChild);
        }
       
        // Check if there is a span as the second child
        const secondChild = label.childNodes[1];
        if (secondChild && secondChild.nodeName === 'BR') {
            // Remove the span
            label.removeChild(secondChild);
        } 
        
        label.style.backgroundColor = '#007BFF'
        label.style.color = 'white'
        const originalPosition = habitItem.getAttribute('data-original-position');
        const originalIndex = parseInt(originalPosition, 10);
 
    // Check if the original position is a valid index
    if (!isNaN(originalIndex) && originalIndex < habitList.children.length) {
      const referenceNode = habitList.children[originalIndex];
      habitList.insertBefore(habitItem, referenceNode);
    }
  
    }
    let completion_date = getFormattedDate(new Date(checkbox.getAttribute('id')))
    $.ajax({
        type:'post',
        url:'/api/v1/users/habit/changeStatus',
        data:{
            status:status,
            habit:habit,
            completion_date:completion_date
        },
        success:function(data){
            
            // Display a success message and redirect to the home page
            new Noty({
                theme:'relax',
                text:'Work Done!',
                type:'success',
                layout:'topRight',
                timeout:500
            }).show()
           
        },error:function(error){
            console.log(error.responseText)
        }
    })
  }
                         