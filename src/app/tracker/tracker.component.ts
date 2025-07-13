import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
interface FinancialRecord {
  sno: number;
  description: string;
  date: string;
  amount: number;
}
@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css'
})
export class TrackerComponent implements OnInit, AfterViewInit {
  @ViewChild('financialRows') financialRows!: ElementRef<HTMLTableSectionElement>;
  @ViewChild('pagination') pagination!: ElementRef<HTMLDivElement>;

  title = 'Durga Mata Financial Tracker';
  summaries = [
    { name: 'Sponsors', amount: 0, target: 20000 },
    { name: 'Spare Amount', amount: 0, target: 100000 },
    { name: 'Estimation', amount: 0, target: 200000 },
    { name: 'Chanda', amount: 0, target: 10000 },
    { name: 'Total Budget Left', amount: 0, target: 130999 }
  ];

  financialRecords: FinancialRecord[] = [
    { sno: 1, description: 'Donation from Sponsors', date: '2025-07-09 10:17 PM', amount: 20000 },
    { sno: 2, description: 'Chanda Collection', date: '2025-07-09 10:17 PM', amount: 10000 }
  ];

  rowsPerPage = 5;
  currentPage = 1;
  pageCount = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.pageCount = Math.ceil(this.financialRecords.length / this.rowsPerPage);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.animateSummaries();
      this.renderPage(this.currentPage);
    }
  }

  animateSummaries() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.summaries.forEach((summary, index) => {
      const box = document.querySelector(`.summary-box-${index}`);
      if (box) {
        const name = box.querySelector('.name');
        const amount = box.querySelector('.amount');
        const count = amount?.querySelector('.count');
        if (name && amount && count) {
          name.setAttribute('style', 'opacity: 0');
          amount.setAttribute('style', 'opacity: 0');
          count.textContent = '0';

          setTimeout(() => {
            name.setAttribute('style', 'animation: slideUpFade 1s ease-out forwards');
            amount.setAttribute('style', 'animation: slideUpFade 1s ease-out forwards');
          }, 100);

          setTimeout(() => {
            let start = 0;
            const startTime = performance.now();
            const duration = 1000;

            const animate = (time: number) => {
              const elapsed = time - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const current = Math.floor(progress * summary.target);
              count.textContent = current.toLocaleString();
              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };
            requestAnimationFrame(animate);
          }, 1000);
        }
      }
    });
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
openAddRecordDialog(){}
}

