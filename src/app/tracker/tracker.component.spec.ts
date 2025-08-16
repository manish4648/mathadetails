import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackerComponent } from './tracker.component';
import { Firestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('TrackerComponent', () => {
  let component: TrackerComponent;
  let fixture: ComponentFixture<TrackerComponent>;
  let mockFirestore: jasmine.SpyObj<Firestore>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const firestoreSpy = jasmine.createSpyObj('Firestore', ['collection']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [TrackerComponent, BrowserAnimationsModule],
      providers: [
        { provide: Firestore, useValue: firestoreSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackerComponent);
    component = fixture.componentInstance;
    mockFirestore = TestBed.inject(Firestore) as jasmine.SpyObj<Firestore>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    // Mock the getFinancialRecords method
    spyOn(component, 'getFinancialRecords').and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pagination properties', () => {
    expect(component.pageSize).toBe(5);
    expect(component.pageIndex).toBe(0);
    expect(component.totalRecords).toBe(0);
    expect(component.pageSizeOptions).toEqual([5, 10, 25, 50]);
  });

  it('should update paginated records correctly', () => {
    // Setup test data
    component.financialRecords = [
      { sno: 1, description: 'Test 1', date: '2024-01-01', amount: 100 },
      { sno: 2, description: 'Test 2', date: '2024-01-02', amount: 200 },
      { sno: 3, description: 'Test 3', date: '2024-01-03', amount: 300 },
      { sno: 4, description: 'Test 4', date: '2024-01-04', amount: 400 },
      { sno: 5, description: 'Test 5', date: '2024-01-05', amount: 500 },
      { sno: 6, description: 'Test 6', date: '2024-01-06', amount: 600 }
    ];
    component.pageSize = 5;
    component.pageIndex = 0;

    component.updatePaginatedRecords();

    expect(component.paginatedRecords.length).toBe(5);
    expect(component.paginatedRecords[0].sno).toBe(1);
    expect(component.paginatedRecords[4].sno).toBe(5);
  });

  it('should handle page change correctly', () => {
    const mockPageEvent = {
      pageIndex: 1,
      pageSize: 10,
      length: 20
    };

    spyOn(component, 'updatePaginatedRecords');

    component.onPageChange(mockPageEvent);

    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(10);
    expect(component.updatePaginatedRecords).toHaveBeenCalled();
  });

  it('should calculate total amount correctly', () => {
    component.financialRecords = [
      { sno: 1, description: 'Test 1', date: '2024-01-01', amount: 100 },
      { sno: 2, description: 'Test 2', date: '2024-01-02', amount: 200 },
      { sno: 3, description: 'Test 3', date: '2024-01-03', amount: 300 }
    ];

    const total = component.getTotalAmount();
    expect(total).toBe(600);
  });
});
