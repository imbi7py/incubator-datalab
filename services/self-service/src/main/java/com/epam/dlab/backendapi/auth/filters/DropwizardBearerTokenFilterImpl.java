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

package com.epam.dlab.backendapi.auth.filters;

import org.keycloak.adapters.AdapterDeploymentContext;
import org.keycloak.adapters.KeycloakDeployment;
import org.keycloak.adapters.NodesRegistrationManagement;
import org.keycloak.jaxrs.JaxrsBearerTokenFilterImpl;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.PreMatching;

@PreMatching
@Priority(Priorities.AUTHENTICATION)
public class DropwizardBearerTokenFilterImpl extends JaxrsBearerTokenFilterImpl {

	public DropwizardBearerTokenFilterImpl(KeycloakDeployment keycloakDeployment) {
		deploymentContext = new AdapterDeploymentContext(keycloakDeployment);
		nodesRegistrationManagement = new NodesRegistrationManagement();
	}
}