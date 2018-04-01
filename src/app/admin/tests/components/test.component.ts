import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { TestService } from '../services/test.service';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  subjects = [];
  tests = [];
  testForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private testService: TestService ) { }

  ngOnInit() {
    this.initForm();

    this.testService.getTest().subscribe((res: any[]) => {
      this.tests = res;
    });

    this.testService.getSubjects().subscribe((res: any[]) => {
      this.subjects = res;
      console.log(this.subjects);
    });
  }

  openCreateTest(content) {
    this.modalService.open(content).result.then((result) => {
      if (result === 'save') {
        this.saveData();
      }
    });
  }

  private initForm() {
    this.testForm = this.formBuilder.group({
      test_name: ['', Validators.required ],
      tasks: ['', Validators.required ],
      time_for_test:  ['00:01:00', Validators.required ],
      enabled: ['', Validators.required ],
      attempts: ['', Validators.required],
      subject_id: ['', Validators.required ]
    });
  }

  private saveData() {
    if (this.testForm.valid) {
      this.testService.addNewTest(this.testForm.getRawValue()).subscribe((res: any[]) => {
        if (res && res.length > 0) {
          this.tests.push(res[0]);
        }
      });
    }
  }
}
