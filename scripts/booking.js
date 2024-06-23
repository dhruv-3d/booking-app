document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        dateClick: function(info) {
            handleDateClick(info);
        },
        select: function(info) {
            handleDateSelect(info);
        }
    });

    calendar.render();

    var bookingModal = document.getElementById('bookingModal')
    var modal = bootstrap.Modal.getInstance(bookingModal)
    bookingModal.addEventListener('show.bs.modal', function (event) {
      console.log("Triggered Event: show.bs.modal", event)
    });

    bookingModal.addEventListener('shown.bs.modal', function (event) {
        console.log("Triggered Event: shown.bs.modal", event)
    });

    bookingModal.addEventListener('hide.bs.modal', function (event) {
        console.log("Triggered Event: hide.bs.modal", event)
    });

    bookingModal.addEventListener('hidden.bs.modal', function (event) {
        console.log("Triggered Event: hidden.bs.modal", event)
    });

    bookingModal.addEventListener('hidePrevented.bs.modal', function (event) {
        console.log("Triggered Event: hidePrevented.bs.modal", event)
    });

    function handleDateClick(info) {
        // Show booking options in the modal for the clicked date
        let options = `
            <div>
                <button class="btn btn-primary m-2" data-dismiss="modal" onclick="bookWholeDay('${info.dateStr}')">Book Whole Day</button>
                <button class="btn btn-primary m-2" data-dismiss="modal" onclick="bookHalfDay('${info.dateStr}', 'morning')">Book Morning Half</button>
                <button class="btn btn-primary m-2" data-dismiss="modal" onclick="bookHalfDay('${info.dateStr}', 'afternoon')">Book Afternoon Half</button>
                <button class="btn btn-primary m-2" data-dismiss="modal" onclick="bookSpecificHours('${info.dateStr}')">Book Specific Hours</button>
            </div>
        `;
        document.getElementById('bookingOptions').innerHTML = options;
        // var bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
        modal.show();
    }

    function handleDateSelect(info) {
        // Show booking options in the modal for the selected date range
        let options = `
            <div>
                <button class="btn btn-primary m-2" data-dismiss="modal" onclick="bookDateRange('${info.startStr}', '${info.endStr}')">Book Date Range</button>
                <button class="btn btn-primary m-2" data-dismiss="modal" onclick="bookHalfDaysRange('${info.startStr}', '${info.endStr}', 'morning')">Book Morning Halves</button>
                <button class="btn btn-primary m-2" data-dismiss="modal" onclick="bookHalfDaysRange('${info.startStr}', '${info.endStr}', 'afternoon')">Book Afternoon Halves</button>
            </div>
        `;
        document.getElementById('bookingOptions').innerHTML = options;
        // var bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
        modal.show();
    }

    window.bookWholeDay = function(dateStr) {
        calendar.addEvent({
            title: 'Booked: Whole Day',
            start: dateStr,
            allDay: true
        });
        hideModal();
    }

    window.bookHalfDay = function(dateStr, half) {
        let start = half === 'morning' ? `${dateStr}T08:00:00` : `${dateStr}T14:00:00`;
        let end = half === 'morning' ? `${dateStr}T12:00:00` : `${dateStr}T18:00:00`;
        calendar.addEvent({
            title: `Booked: ${half.charAt(0).toUpperCase() + half.slice(1)} Half`,
            start: start,
            end: end
        });
        hideModal();
    }

    window.bookSpecificHours = function(dateStr) {
        let hours = prompt('Enter booking hours (e.g., 10:00-12:00)');
        if (hours) {
            let [start, end] = hours.split('-');
            calendar.addEvent({
                title: 'Booked: Specific Hours',
                start: `${dateStr}T${start}:00`,
                end: `${dateStr}T${end}:00`
            });
            hideModal();
        }
    }

    window.bookDateRange = function(startStr, endStr) {
        calendar.addEvent({
            title: 'Booked: Date Range',
            start: startStr,
            end: endStr
        });
        hideModal();
    }

    window.bookHalfDaysRange = function(startStr, endStr, half) {
        let currentDate = new Date(startStr);
        let endDate = new Date(endStr);

        while (currentDate < endDate) {
            let dateStr = currentDate.toISOString().split('T')[0];
            bookHalfDay(dateStr, half);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        hideModal();
    }

    function hideModal() {
        modal.hide();
    }
});
