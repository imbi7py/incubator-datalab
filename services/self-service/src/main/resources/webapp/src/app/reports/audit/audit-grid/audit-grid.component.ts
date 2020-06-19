/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {Component, Inject, OnInit} from '@angular/core';
import {FilterAuditModel} from '../filter-audit.model';
import {NotificationDialogComponent} from '../../../shared/modal-dialog/notification-dialog';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AuditService} from '../../../core/services/audit.service';

@Component({
  selector: 'dlab-audit-grid',
  templateUrl: './audit-grid.component.html',
  styleUrls: ['./audit-grid.component.scss'],

})
export class AuditGridComponent implements OnInit {
  public auditData: Array<object>;
  public displayedColumns: string[] = ['user', 'project', 'resource', 'action', 'date'];
  public displayedFilterColumns: string[] = ['user-filter', 'project-filter', 'resource-filter', 'action-filter', 'date-filter'];
  public collapseFilterRow: boolean = true;
  public filterConfiguration: FilterAuditModel = new FilterAuditModel([], [], [], [], '', '');
  public filterAuditData: FilterAuditModel = new FilterAuditModel([], [], [], [], '', '');
  public itemsPrPage: Number[] = [25, 50, 100];
  public showItemsPrPage: number = 25;
  public firstItem: number = 1;
  public lastItem: number = this.showItemsPrPage;


  constructor(
    public dialogRef: MatDialogRef<AuditInfoDialogComponent>,
    public dialog: MatDialog,
    private auditService: AuditService,
  ) {
  }

  ngOnInit() {}

  public refreshAudit() {
    this.auditService.getAuditData().subscribe(auditData => {
      this.auditData = auditData;
      this.createFilterData(this.auditData);
    });
  }

  public setAvaliblePeriod(period) {
    this.filterConfiguration.date_start = period.start_date;
    this.filterConfiguration.date_end = period.end_date;
  }

  public createFilterData (auditData) {
    const users = [];
    const resource = [];
    const project = [];
    const actions = [];
    auditData.forEach(auditItem => {
      if (auditItem.user && !users.includes(auditItem.user)) {
        users.push(auditItem.user);
      }
      if (auditItem.resourceName && !resource.includes(auditItem.resourceName)) {
        resource.push(auditItem.resourceName);
      }
      if (auditItem.project && !project.includes(auditItem.project)) {
        project.push(auditItem.project);
      }
      if (auditItem.action && !actions.includes(auditItem.action)) {
        actions.push(auditItem.action);
      }
    });
    this.filterConfiguration = new FilterAuditModel(users, resource, project || [], actions, '', '');
  }

  toggleFilterRow(): void {
    this.collapseFilterRow = !this.collapseFilterRow;
  }

  onUpdate($event): void {
    this.filterAuditData[$event.type] = $event.model;
  }

  openActionInfo(element) {
    // console.log('Open audit info ' + action.action);
    this.dialog.open(AuditInfoDialogComponent, { data: {data: element.info, action: element.action}, panelClass: 'modal-xl-s' });
  }

  public setItemsPrPage(item: number) {
    this.lastItem = item;
  }

  public loadItems(action) {
    if (action === 'first') {
      this.firstItem = 1;
      this.lastItem = this.showItemsPrPage;
    } else if (action === 'previous') {
      this.firstItem = this.firstItem - this.showItemsPrPage;
      this.lastItem = this.lastItem % this.showItemsPrPage === 0 ? this.lastItem - this.showItemsPrPage : this.lastItem - (this.lastItem % this.showItemsPrPage);
    } else if (action === 'next') {
      this.firstItem = this.firstItem + this.showItemsPrPage;
      this.lastItem = (this.lastItem + this.showItemsPrPage) > this.auditData.length ? this.auditData.length : this.lastItem + this.showItemsPrPage;
    } else if (action === 'last') {
      this.firstItem = this.auditData.length % this.showItemsPrPage === 0 ? this.auditData.length - this.showItemsPrPage : this.auditData.length - (this.auditData.length % this.showItemsPrPage) + 1;
      this.lastItem = this.auditData.length;
    }
  }
}

@Component({
  selector: 'audit-info-dialog',
  template: `
      <div id="dialog-box">
          <header class="dialog-header">
              <h4 class="modal-title">{{data.action | convertaction}}</h4>
              <button type="button" class="close" (click)="dialogRef.close()">&times;</button>
          </header>
          <div mat-dialog-content class="content audit-info-content">
<!--            <ul info-items-list *ngIf=" dattypeofa.data.length>1;else message">-->
            <mat-list *ngIf="actionList[0].length > 1;else message">
<!--              <li class="info-item">-->
<!--                  <span class="info-item-title">Action</span>-->
<!--                  <span class="info-item-data"> Description </span>-->
<!--              </li>-->
              <mat-list-item class="list-header">
                <div class="info-item-title">Action</div>
                <div class="info-item-data"> Description </div>
              </mat-list-item>
              <div class="scrolling-content mat-list-wrapper" id="scrolling">
                <mat-list-item class="list-item" *ngFor="let action of actionList">
                  <div class="info-item-title">{{action[0]}}</div>
                  <div class="info-item-data" >
                      <div *ngFor="let description of action[1]?.split(',')">{{description}}</div>
                  </div>
                </mat-list-item>
              </div>
            </mat-list>
            <ng-template #message><p>{{data.data}}.</p></ng-template>
<!--            <p >{{data.data}}</p>-->
            <div class="text-center m-top-30 m-bott-10">
<!--               <button type="button" class="butt" mat-raised-button (click)="dialogRef.close()">No</button>-->
<!--               <button type="button" class="butt butt-success" mat-raised-button-->
<!--                       (click)="dialogRef.close(true)">Yes-->
<!--               </button>-->
             </div>
          </div>
      </div>
  `,
  styles: [`
    .content { color: #718ba6; padding: 20px 50px; font-size: 14px; font-weight: 400; margin: 0; }
    .info { color: #35afd5; }
    .info .confirm-dialog { color: #607D8B; }
    header { display: flex; justify-content: space-between; color: #607D8B; }
    header h4 i { vertical-align: bottom; }
    header a i { font-size: 20px; }
    header a:hover i { color: #35afd5; cursor: pointer; }
    .plur { font-style: normal; }
    .scrolling-content{overflow-y: auto; max-height: 200px; }
    .endpoint { width: 70%; text-align: left; color: #577289;}
    .status { width: 30%;text-align: left;}
    .label { font-size: 15px; font-weight: 500; font-family: "Open Sans",sans-serif;}
    .node { font-weight: 300;}
    .resource-name { width: 280px;text-align: left; padding: 10px 0;line-height: 26px;}
    .project { width: 30%;text-align: left; padding: 10px 0;line-height: 26px;}
    .resource-list{max-width: 100%; margin: 0 auto;margin-top: 20px; }
    .resource-list-header{display: flex; font-weight: 600; font-size: 16px;height: 48px; border-top: 1px solid #edf1f5; border-bottom: 1px solid #edf1f5; padding: 0 20px;}
    .resource-list-row{display: flex; border-bottom: 1px solid #edf1f5;padding: 0 20px;}
    .confirm-resource-terminating{text-align: left; padding: 10px 20px;}
    .confirm-message{color: #ef5c4b;font-size: 13px;min-height: 18px; text-align: center; padding-top: 20px}
    .checkbox{margin-right: 5px;vertical-align: middle; margin-bottom: 3px;}
    label{cursor: pointer}
    .bottom-message{padding-top: 15px;}
    .table-header{padding-bottom: 10px;}
    .mat-list-wrapper{padding-top: 5px;}
    .list-item{color: #718ba6; height: auto;}
    .info-item-title{width: 40%; padding: 10px 0}
    .info-item-data{width: 60%; text-align: left; padding: 10px 0}


  `]
})
export class AuditInfoDialogComponent {
  actionList;
  constructor(
    public dialogRef: MatDialogRef<AuditInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.actionList = data.data.split('.').map(v => v.split(':')).filter(v => v[0] !== '');
    console.log(this.actionList);
  }

}