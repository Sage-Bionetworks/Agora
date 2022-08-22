// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DomSanitizer } from '@angular/platform-browser';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { WikiComponent } from './';
import { SynapseApiService } from '../../../core/services';
import { SynapseApiServiceStub, synapseWikiMock } from '../../../testing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Wiki', () => {
  let fixture: ComponentFixture<WikiComponent>;
  let component: WikiComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WikiComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: SynapseApiService, useValue: new SynapseApiServiceStub() },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: () => 'test',
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(WikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have data', fakeAsync(() => {
    const noiSpy = spyOn(component, 'ngOnInit').and.callThrough();

    component.wikiId = synapseWikiMock.id;
    component.ngOnInit();
    fixture.detectChanges();

    expect(noiSpy).toHaveBeenCalled();
    expect(component.data?.id).toEqual(component.wikiId);
    expect(element.querySelector('.wiki-inner')?.innerHTML).not.toEqual('');
  }));
});
