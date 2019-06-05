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
import { DICTIONARY } from '../../../dictionary/global.dictionary';

export class ExploratoryModel {
  readonly DICTIONARY = DICTIONARY;

  constructor(
    public name: Array<any>,
    public template_name: string,
    public image: string,
    public status: string,
    public shape: string,
    public resources: Array<any>,
    public time: string,
    public url: Array<any>,
    public ip: string,
    public username: string,
    public password: string,
    public bucket_name: string,
    public shared_bucket_name: string,
    public error_message: string,
    public cost: number,
    public currency_code: string,
    public billing: Array<any>,
    public libs: Array<any>,
    public account_name: string,
    public shared_account_name: string,
    public datalake_name: string,
    public datalake_directory: string,
    public datalake_shared_directory: string,
    public project: string,
    public endpoint: string,
  ) { }

  public static loadEnvironments(exploratoryList: Array<any>, sharedDataList: any): Array<ExploratoryModel> {
    if (exploratoryList && sharedDataList) {
      return exploratoryList.map((value) => {
        return new ExploratoryModel(value.exploratory_name,
          value.template_name,
          value.image,
          value.status,
          value.shape,
          value.computational_resources,
          value.up_time,
          value.exploratory_url,
          sharedDataList.edge_node_ip,
          value.exploratory_user,
          value.exploratory_pass,
          sharedDataList[DICTIONARY.bucket_name],
          sharedDataList[DICTIONARY.shared_bucket_name],
          value.error_message,
          value[DICTIONARY.billing.cost],
          value[DICTIONARY.billing.currencyCode],
          value.billing,
          value.libs,
          sharedDataList[DICTIONARY.user_storage_account_name],
          sharedDataList[DICTIONARY.shared_storage_account_name],
          sharedDataList[DICTIONARY.datalake_name],
          sharedDataList[DICTIONARY.datalake_user_directory_name],
          sharedDataList[DICTIONARY.datalake_shared_directory_name],
          value.project,
          value.endpoint
        );
      });
    }
  }
}
