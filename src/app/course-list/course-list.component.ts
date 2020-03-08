import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FuiModalService, TemplateModalConfig, ModalTemplate } from 'ngx-fomantic-ui';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { CourseService } from '../providers/course.service';
import { Course } from '../models/course';

interface IContext {
    totalPrice:number;
}


@Component({
  selector: '[app-course-list]',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  @ViewChild('modalTemplate', {static: false})
  modalTemplate:ModalTemplate<IContext, string, string>;
  private totalPrice;

  constructor(private courseservice: CourseService,
    private modalService:FuiModalService) {
  }

  ngOnInit(): void {
    //Get the service list to show
    this.courseservice.getAll().subscribe(courses => {
      this.courses = courses;
      //Calculate the total prices
      this.totalPrice = courses.reduce((sum, course) => sum + course.price, 0);
    });
  }

  /*
  A handler for the course detial delete event
  */
  courseDeleted(course) {
    //Remove the deleted course from the courses array
    this.courses = this.courses.filter(c => c.id != course.id);
    //Update the totalPrice summary
    this.totalPrice -= course.price;
  }

  /*
  Open a modal to show the total price
  */
  showTotalPrice() {
    const config = new TemplateModalConfig<IContext, string, string>(this.modalTemplate);
    config.context = { totalPrice: this.totalPrice };
    config.size = 'mini'; // mini, tiny, small, normal & large.

    this.modalService
        .open(config);
  }
}
