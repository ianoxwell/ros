import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageStatus } from '@models/message.model';
import { ToastItemComponent } from './toast-item.component';

describe('ToastItemComponent', () => {
  let component: ToastItemComponent;
  let fixture: ComponentFixture<ToastItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, BrowserAnimationsModule],
      declarations: [ToastItemComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastItemComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct icon', () => {
    const iconList: string[] = [
      component.getIconName(MessageStatus.Error),
      component.getIconName(MessageStatus.Warning),
      component.getIconName(MessageStatus.Alert),
      component.getIconName(MessageStatus.Critical),
      component.getIconName(MessageStatus.Success),
      component.getIconName(MessageStatus.None)
    ];
    expect(iconList).toEqual(['error_outline', 'warning', 'add_alert', 'error', 'done', '']);
  });

  it('should close item when closed', () => {
    const closeToastSpy = spyOn(component.closeToast, 'emit');
    component.onCloseIconClick(new MouseEvent('mouseOver'));

    expect(closeToastSpy).toHaveBeenCalled();
  });
});
