import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Firestore  ,collection, addDoc, getDocs, collectionData } from '@angular/fire/firestore';
import { AddRecordDialogComponent } from '../add-record-dialog/add-record-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
interface FinancialRecord {
  sno: number;
  description: string;
  date: string;
  amount: number;
}
@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [CommonModule,MatDialogModule ],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css'
})
export class TrackerComponent implements OnInit, AfterViewInit {
  @ViewChild('financialRows') financialRows!: ElementRef<HTMLTableSectionElement>;
  @ViewChild('pagination') pagination!: ElementRef<HTMLDivElement>;

  title = 'Durga Mata Financial Tracker';
  summaries = [
    { name: 'Sponsors', amount: 0, target: 20000, displayAmount: 0 },
    { name: 'Spare Amount', amount: 0, target: 100000, displayAmount: 0 },
    { name: 'Estimation', amount: 0, target: 200000, displayAmount: 0 },
    { name: 'Chanda', amount: 0, target: 10000, displayAmount: 0 },
    { name: 'Total Budget Left', amount: 0, target: 130999, displayAmount: 0 }
  ];

  description = '';
  amount = 0;
  financialRecords: FinancialRecord[] = [];

  rowsPerPage = 5;
  currentPage = 1;
  pageCount = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private firestore: Firestore,private dialog: MatDialog ) {}

  async ngOnInit() {
    this.pageCount = Math.ceil(this.financialRecords.length / this.rowsPerPage);
    this.getFinancialRecords().subscribe(data => {
      this.financialRecords = data;
    });
  }
  

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Start counting animation after a short delay
      setTimeout(() => {
        this.startCountingAnimation();
      }, 500);
      this.renderPage(this.currentPage);
    }
  }

  startCountingAnimation() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.summaries.forEach((summary, index) => {
      // Stagger the animation start for each box
      setTimeout(() => {
        this.animateCounter(summary, index);
      }, index * 200); // 200ms delay between each box
    });
  }

  animateCounter(summary: any, index: number) {
    const duration = 2000; // 2 seconds for counting animation
    const startTime = performance.now();
    const startValue = 0;
    const endValue = summary.target;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

      // Update the display amount
      summary.displayAmount = currentValue;

      // Add pulse effect during counting
      const amountElement = document.querySelector(`.summary-box-${index} .amount`);
      if (amountElement) {
        amountElement.classList.add('counting');
        setTimeout(() => {
          amountElement.classList.remove('counting');
        }, 100);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Final value
        summary.displayAmount = endValue;
      }
    };

    requestAnimationFrame(animate);
  }

  deleteRow(index: number) {
    if (!isPlatformBrowser(this.platformId)) return;

    const globalIndex = (this.currentPage - 1) * this.rowsPerPage + index;
    const row = this.financialRows.nativeElement.querySelector(`tr[data-index="${index}"]`);
    if (row) {
      row.classList.add('fade-out');
      setTimeout(() => {
        this.financialRecords.splice(globalIndex, 1);
        this.financialRecords = this.financialRecords.map((record, i) => ({
          ...record,
          sno: i + 1
        }));
        this.pageCount = Math.ceil(this.financialRecords.length / this.rowsPerPage);
        if (this.currentPage > this.pageCount && this.pageCount > 0) {
          this.currentPage = this.pageCount;
        }
        this.renderPage(this.currentPage);
      }, 600);
    }
  }

  renderPage(page: number) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.currentPage = page;
    const start = (page - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    const paginatedRecords = this.financialRecords.slice(start, end);

    if (this.pagination && this.pagination.nativeElement) {
      this.pagination.nativeElement.innerHTML = '';
      for (let i = 1; i <= this.pageCount; i++) {
        const btn = document.createElement('button');
        btn.textContent = i.toString();
        btn.className = `px-3 py-1 rounded-full border border-yellow-300 hover:bg-yellow-300 hover:text-black ${i === page ? 'bg-yellow-300 text-black' : ''}`;
        btn.addEventListener('click', () => this.renderPage(i));
        this.pagination.nativeElement.appendChild(btn);
      }
    }
  }

  refresh() {
    if (isPlatformBrowser(this.platformId)) {
      window.location.reload();
    }
  }

  getPaginatedRecords(): FinancialRecord[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.financialRecords.slice(start, end);
  }
  addEntry(q:any){

  }

  deleteEntry(q:any){

  }
openAddRecordDialog() {
    const dialogRef = this.dialog.open(AddRecordDialogComponent, {
      width: '400px',
      backdropClass: 'mat-backdrop-black',
      panelClass: 'add-record-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        try {
          const docRef = await addDoc(collection(this.firestore, 'financialRecords'), {
            description: result.description,
            date: result.date,
            amount: Number(result.amount),
            createdAt: new Date()
          });
          this.financialRecords.push({
            sno: this.financialRecords.length + 1,
            description: result.description,
            date: result.date,
            amount: Number(result.amount)
          });
          console.log('Saved to Firestore with id:', docRef.id);
        } catch (err) {
          console.error('Error adding document to Firestore:', err);
        }
      }
    });
  }
updateEntry(record: any){
  
}
  getTotalAmount(): number {
    return this.financialRecords.reduce((sum, r) => sum + r.amount, 0);
  }
   getFinancialRecords(): Observable<any[]> {
    const recordsRef = collection(this.firestore, 'financialRecords');
    return collectionData(recordsRef, { idField: 'id' }) as Observable<any[]>;
  }
}

