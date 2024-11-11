import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private selectedSegmentSubject = new BehaviorSubject<string>('filmes'); // Define 'filmes' como padrão
  selectedSegment$ = this.selectedSegmentSubject.asObservable(); // Observável para ouvir mudanças

  setSelectedSegment(segment: string) {
    this.selectedSegmentSubject.next(segment);
  }

  getSelectedSegment(): string {
    return this.selectedSegmentSubject.value; // Pega o valor atual
  }
}