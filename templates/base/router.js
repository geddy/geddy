/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/


var router = new geddy.RegExpRouter();
router.match('/').to({controller: 'Main', action: 'index'});

// Basic routes
// router.match('/moving/pictures/:id').to(
//    {controller: 'Moving', action: 'pictures'});
// router.match('/farewells/:farewelltype/kings/:kingid').to(
//    {controller: 'Farewells', action: 'kings'});
// Can also match specific HTTP methods only
// router.match('/xandadu', 'get').to(
//    {controller: 'Xandadu', action: 'specialHandler'});
//
// Resource-based routes
// router.resource('hemispheres');

exports.router = router;

