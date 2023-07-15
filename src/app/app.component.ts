import { Component } from '@angular/core';

interface Seat {
  number: number;
  booked: boolean;
  selected: boolean;
}

interface Row {
  seats: Seat[];
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  rows: Row[] = [];
  selectedSeats: Seat[] = [];
  bookingConfirmed = false;
  bookedSeatNumbers: string = '';

  constructor() {
    this.initializeSeats();
  }

  initializeSeats(): void {
    const lastRowIndex = 12;
    for (let i = 0; i < lastRowIndex; i++) {
      const row: Row = { seats: [] };
      const seatCount = i === lastRowIndex - 1 ? 3 : 7;
      for (let j = 0; j < seatCount; j++) {
        const seat: Seat = {
          number: i * 7 + j + 1,
          booked: false,
          selected: false,
        };
        row.seats.push(seat);
      }
      this.rows.push(row);
    }
  }

  bookSeats(): void {
    const numberOfSeats = Number(this.seatCount);
    let remainingSeats = numberOfSeats;

    if (numberOfSeats > 0 && numberOfSeats <= 7) {
      let allocatedSeats: Seat[] = [];

      // Iterate through the rows to find available seats
      for (const row of this.rows) {
        const availableSeats: Seat[] = row.seats.filter(
          (seat) => !seat.booked && !seat.selected
        );

        if (availableSeats.length >= numberOfSeats) {
          allocatedSeats = availableSeats.slice(0, numberOfSeats);
          remainingSeats = 0;
          break;
        }
      }

      if (remainingSeats !== 0) {
        for (const row of this.rows) {
          const availableSeats: Seat[] = row.seats.filter(
            (seat) => !seat.booked && !seat.selected
          );

          if (availableSeats.length > 0) {
            const seatsToAllocate = Math.min(
              remainingSeats,
              availableSeats.length
            );
            allocatedSeats = [
              ...allocatedSeats,
              ...availableSeats.slice(0, seatsToAllocate),
            ];
            remainingSeats -= seatsToAllocate;

            if (remainingSeats === 0) {
              break;
            }
          }
        }
      }

      if (allocatedSeats.length === numberOfSeats) {
        const allocatedArray = allocatedSeats.map((seat) => seat.number);
        const allocatedString = allocatedArray.join(', ');
        allocatedSeats.forEach((seat) => {
          seat.booked = true;
          seat.selected = false;
        });
        this.bookedSeatNumbers = allocatedString;
        console.log(this.bookedSeatNumbers);
        this.bookingConfirmed = true;
      } else {
        alert('No available seats for the requested number.');
      }
    } else {
      alert('Please enter a valid number of seats (1-7).');
    }
  }
}
