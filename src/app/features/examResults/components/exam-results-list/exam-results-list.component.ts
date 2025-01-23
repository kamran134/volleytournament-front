import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-exam-results-list',
  standalone: true,
  imports: [MatGridListModule, MatButtonModule],
  templateUrl: './exam-results-list.component.html',
  styleUrl: './exam-results-list.component.scss'
})
export class ExamResultsListComponent {

}
