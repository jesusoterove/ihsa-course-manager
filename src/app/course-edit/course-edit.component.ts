import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, AbstractControl, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { Course } from '../models/course';
import { CourseService } from '../providers/course.service';
import { MessagingService } from '../providers/messaging.service';

const MAX_PRICE = 25;
const isoDate = function(date:Date) {
  return date.toISOString().substring(0, 10);
}

const validDate = (formControl: AbstractControl): ValidationErrors | null => {
  var d = moment(formControl.value);
  return d.isValid() && d.isSameOrAfter(moment().startOf('day')) ? null: { validDate: { value: formControl.value } };
};

const priceLessThan = (maximum:number) => {
  return (formControl: AbstractControl): ValidationErrors | null => {
    var value:number = parseFloat(formControl.value);
    return !isNaN(value) && value >= 0 && value < maximum ? null: { pricessLessThan: { value: formControl.value } };
  };
};

type SaveCourseFn = (course:Course) => Observable<any>;

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit {

  course$: Observable<Course>;
  courseForm: FormGroup;
  submitAction: string;
  loading: boolean = true;
  submitted: boolean = false;
  private dp: DatePipe = new DatePipe(navigator.language);
  private isNew: boolean;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private messageService: MessagingService,
    private route: ActivatedRoute,
    private router: Router) { }

  /*
  Initialize a reactive form with the course information being updating, or new object if it is new course
  */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isNew = /new/i.test(id);
    this.submitAction = this.isNew ? "Create" : "Update";
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern("^[a-zA-Z]+$")]],
      startDate: ['', [validDate]],
      price: ['', [priceLessThan(MAX_PRICE)]]
    });

    if (!this.isNew) {
      //If updating a course, get the information from the service
      this.courseService.get(id).subscribe(course => {
        if (course == null) { //If the service is not able to found the course, return to the list.
          this.goBack();
          return;
        }
        //Update the form with the course information
        this.courseForm.patchValue({
          name: course.name,
          startDate: isoDate(course.startDate),
          price: course.price
        });
        this.loading = false;
      });
    }
    else {
        this.loading = false;
    }
  }
  
  //A method to return to the course list by using the router
  goBack() {
    this.router.navigate(['/courses']);
  }

  /*
  Update/Create the course when the form information has been validated
  */
  update() {
    this.submitted = true; //Update this flag so validation errors are shown inline
    if (!this.courseForm.valid) return; //If the form is invalid, do nothing

    this.loading = true; //Prevent the user from doing further modifications
    let action = this.isNew ? 'create' : 'update';
    //Create a course object
    let course: Course = {
      name: this.courseForm.value.name,
      startDate: moment(this.courseForm.value.startDate).toDate(),
      price: +this.courseForm.value.price
    };

    //If it is an existing course, set the Id
    if (!this.isNew) course.id = +this.route.snapshot.paramMap.get('id');
    //Call the service to update/create the course
    this.courseService[action](course).subscribe((result) => {
      //If the service call succeeds, publish the success message and return to the course list.
      if (result) {
        let text = this.isNew ? `New course ${course.name} has been created` : `${course.name} course has been successfully updated`;
        this.messageService.sendMessage({text: text, type:'success'})
        this.goBack();
      }
      //Remove the loading flag
      this.loading = false;
    });
  }
}
