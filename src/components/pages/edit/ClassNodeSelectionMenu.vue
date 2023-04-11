<template>
  <!-- Name -->
  <details class="duration-300 text-white border-b-4 p-4 border-gray-900">
    <summary class="flex">
      <font-awesome-icon icon="fa-solid fa-pen-to-square" color="white" class="my-auto cursor-pointer mx-2"/>
      <div class="flex grow" @click.prevent>
        <h1 class="grow my-auto normal-case">
          {{ selectedNodeData.classData.name }}
        </h1>
        <font-awesome-icon icon="fa-solid fa-trash" color="red" class="cursor-pointer my-auto mx-2" @click="removeNodes([`${getSelectedNodes[0].id}`])"/>
      </div>
    </summary>
    <div class="mx-2 hover:shadow-lg hover:shadow-gray-500 border border-slate-600 hover:border-gray-500">
      <ul class="p-2 space-y-2">
        <!-- Class name editing -->
        <li class="flex">
          <label class="normal-case text-left">Name:</label>
          <input class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                 :value="selectedNodeData.classData.name"
                 @keyup.enter="changeClassName($event.target)"
                 @focusout="onClassNameInputLostFocus($event.target)"
          />
        </li>
      </ul>
    </div>
  </details>

  <!-- Constructor controls -->
  <details class="bg-inherit duration-300 border-b-4 border-gray-900">
    <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Constructors</summary>
    <div class="hover:bg-gray-400 py-2 border-b border-gray-900 cursor-pointer" @click="addConstructor">
      <font-awesome-icon icon="fa-plus fa-solid" color="white" />
    </div>
    <div class="py-2 text-white normal-case">
      <ul>
        <li v-for="(constructor, constructorIndex) in selectedNodeData.classData.constructors" :key="constructor.id">
          <details class="duration-300 text-white" >
            <summary class="flex my-1">
              <font-awesome-icon icon="fa-solid fa-pen-to-square" color="white" class="my-auto cursor-pointer mx-2"/>
              <div @click.prevent class="flex grow">
                <p class="grow text-white normal-case"> {{ constructor.name }} </p>
                <font-awesome-icon icon="fa-solid fa-xmark" color="red" class="my-auto cursor-pointer mx-2"
                                   @click.prevent="removeConstructor(`${constructorIndex}`)"/>
              </div>
            </summary>
            <div class="mx-2 hover:shadow-lg hover:shadow-gray-500 border border-slate-600 hover:border-gray-500">
              <ul class="p-2 space-y-2">
                <!-- Constructor name editing -->
                <li class="flex">
                  <label class="normal-case text-left w-16">Name:</label>
                  <input class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                         :value="constructor.name"
                         @keyup.enter="changeConstructorName($event.target, constructor)"
                         @focusout="onConstructorNameInputLostFocus($event.target, constructor)"
                  />
                </li>
                <!-- Constructor initialized fields editing -->
                <li>
                  <div v-for="property in selectedNodeData.classData.properties" :key="property.id" class="flex">
                    <input type="checkbox"
                           class="bg-gray-500 rounded ml-1 my-auto px-2 h-5 w-5
                                      border border-gray-500
                                      cursor-pointer
                                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                           :checked="constructor.initializedFieldsIDs.find(fieldID => fieldID === property.id) !== undefined"
                           @change="constructorFieldStatusChanged(constructor, property, $event.target.checked)">
                    <label class="normal-case text-left w-16 ml-3">{{ property.name }}</label>
                  </div>
                </li>
              </ul>
            </div>
          </details>
        </li>
      </ul>
    </div>
  </details>

  <!-- Destructor controls -->
  <details class="bg-inherit duration-300 border-b-4 border-gray-900 text-white">
    <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer border-b border-gray-900">Destructor</summary>
    <div class="flex w-fit mx-auto">
      <label class="normal-case text-right w-fit my-auto">Generate destructor: </label>
      <input type="checkbox"
             class="bg-gray-500 rounded ml-1 my-auto px-2 h-5 w-5
                                        border border-gray-500
                                        cursor-pointer
                                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
             v-model="selectedNodeData.classData.generateDestructor">
    </div>
    <div v-if="selectedNodeData.classData.generateDestructor" class="mx-2 py-2 text-white normal-case">
        <p class="flex">Fields to be deleted: </p>
        <!-- Fields to be deleted by destructor -->
        <div v-for="property in selectedNodeData.classData.properties" :key="property.id" v-show="property.type.pointerList.length > 0"
             class="ml-5 flex">
          <input type="checkbox"
                 class="bg-gray-500 rounded ml-1 my-auto px-2 h-5 w-5
                            border border-gray-500
                            cursor-pointer
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                 :checked="selectedNodeData.classData.destructor.deletedFieldsIds.find(fieldID => fieldID === property.id) !== undefined"
                 @change="destructorFieldStatusChanged(property, $event.target.checked)">
          <label class="normal-case text-left w-16 ml-3">{{ property.name }}</label>
        </div>
    </div>
  </details>

  <!-- Properties controls -->
  <details class="bg-inherit duration-300 border-b-4 border-gray-900">
    <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Properties</summary>
    <div class="hover:bg-gray-400 py-2 border-b border-gray-900 cursor-pointer" @click="addProperty">
      <font-awesome-icon icon="fa-plus fa-solid" color="white" />
    </div>
    <div class="py-2">
      <ul>
        <li v-for="(property, propertyIndex) in selectedNodeData.classData.properties" :key="property.id">
          <details class="duration-300 text-white" >
            <summary class="flex my-1">
              <font-awesome-icon icon="fa-solid fa-pen-to-square" color="white" class="my-auto cursor-pointer mx-2"/>
              <div @click.prevent class="flex grow">
                <p class="grow text-white normal-case"> {{ property.name }} </p>
                <font-awesome-icon icon="fa-solid fa-xmark" color="red" class="my-auto cursor-pointer mx-2"
                                   @click.prevent="removeProperty(`${propertyIndex}`)"/>
              </div>
            </summary>
            <div class="mx-2 hover:shadow-lg hover:shadow-gray-500 border border-slate-600 hover:border-gray-500">
              <ul class="p-2 space-y-2">
                <!-- Property name editing -->
                <li class="flex">
                  <label class="normal-case text-left w-16">Name:</label>
                  <input class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                         :value="property.name"
                         @keyup.enter="changePropertyName($event.target, property)"
                         @focusout="onPropertyNameInputLostFocus($event.target, property)"
                  />
                </li>
                <!-- Property access editing -->
                <li class="flex">
                  <label class="normal-case text-left w-16">Access:</label>
                  <select class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                          v-model="property.accessModifier" @change="propertyAccessChanged">
                    <option v-for="modifier in accessModifiers" :value="modifier">{{ modifier }}</option>
                  </select>
                </li>
                <!-- Property type editing -->
                <li>
                  <div class="flex">
                    <label class="normal-case text-left w-16">Type:</label>
                    <input type="text" list="property-data-types"
                           class="bg-gray-500 rounded ml-1 px-2 w-36
                                      border border-gray-500
                                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                           :value="property.type.name"
                           @keyup.enter="changePropertyType($event.target, property)"
                           @focusout="onPropertyTypeInputLostFocus($event.target, property)"
                    />
                    <datalist id="property-data-types">
                      <option v-for="dataType in generalDataTypes">
                        {{ dataType }}
                      </option>
                    </datalist>
                  </div>
                  <!-- Type const check -->
                  <div class="flex">
                    <label class="normal-case text-left w-12">Const:</label>
                    <input type="checkbox"
                           class="bg-gray-500 rounded ml-2 my-auto px-2 h-5 w-5
                                      border border-gray-500
                                      cursor-pointer
                                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                           v-model="property.type.isConst" @change="flowStore.changesOccurred()">
                  </div>
                </li>
                <!-- Property array dimension list -->
                <li class="flex">
                  <div class="ml-1">
                    <font-awesome-icon icon="fa-plus fa-solid" color="white" size="xs" class="cursor-pointer" @click="addArrayDimension(property.type)"/>
                  </div>
                  <label class="normal-case text-left w-20">Array dimensions:</label>
                  <ul class="ml-5">
                    <li v-for="(dimension, dimensionIdx) in property.type.arrayDimensions" :key="dimension.id" class="flex">
                      <div class="my-2">
                        <div class="w-fit">
                          <label class="normal-case text-left w-16">dimension len store:</label>
                          <input type="text"
                                 class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-20
                                              border border-gray-500
                                              cursor-pointer
                                              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                 :value="dimension.arrayLengthFieldName" @change="arrayLengthFieldNameChanged(dimension, $event.target)"
                                 @focusout="onArrayLengthFieldNameFocusLost(dimension, $event.target)">
                        </div>
                        <div class="flex">
                          <label class="normal-case text-left w-fit ml-2">Max len.:</label>
                          <input type="number"
                                 class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-20
                                      border border-gray-500
                                      cursor-pointer
                                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                 :value="dimension.maxLength" @focusout="maxDimensionLengthChanged(dimension, $event.target)" @keyup.enter="loseFocus">
                        </div>
                      </div>
                      <font-awesome-icon icon="fa-solid fa-xmark" color="red" class="my-auto cursor-pointer mx-2"
                                         @click="removeArrayDimension(property.type, dimensionIdx)"/>
                    </li>
                  </ul>
                </li>
                <!-- Property type pointer list -->
                <li class="flex">
                  <div class="ml-1">
                    <font-awesome-icon icon="fa-plus fa-solid" color="white" size="xs" class="cursor-pointer" @click="addPointer(property.type)"/>
                  </div>
                  <label class="normal-case text-left w-16">Pointers:</label>
                  <ul class="ml-5">
                    <li v-for="(pointer, pointerIdx) in property.type.pointerList" :key="pointer.id" class="flex">
                      <div class="my-2">
                        <div class="w-fit">
                          <label class="normal-case text-left w-16">const {{ pointerIdx }}:</label>
                          <input type="checkbox"
                                 class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-5
                                            border border-gray-500
                                            cursor-pointer
                                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                 v-model="pointer.isConst" @change="flowStore.changesOccurred()">
                        </div>
                        <div class="w-fit">
                          <label class="normal-case text-left w-16">array {{ pointerIdx }}:</label>
                          <input type="checkbox"
                                 class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-5
                                            border border-gray-500
                                            cursor-pointer
                                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                 v-model="pointer.isArray" @change="flowStore.changesOccurred()">
                        </div>
                        <div v-show="pointer.isArray" class="w-fit">
                          <label class="normal-case text-left w-16">array len store:</label>
                          <input type="text"
                                 class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-20
                                              border border-gray-500
                                              cursor-pointer
                                              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                 :value="pointer.arrayLengthFieldName" @change="arrayLengthFieldNameChanged(pointer, $event.target)"
                                 @focusout="onArrayLengthFieldNameFocusLost(pointer, $event.target)">
                        </div>
                      </div>
                      <font-awesome-icon icon="fa-solid fa-xmark" color="red" class="my-auto cursor-pointer mx-2"
                                         @click="removePointer(property.type, pointerIdx), updateDestructorAfterPropertyPointerRemoval(property)"/>
                    </li>
                  </ul>
                </li>
                <!-- Property static check -->
                <li class="flex">
                  <label class="normal-case text-left w-16">Static:</label>
                  <input type="checkbox"
                         class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-5
                                    border border-gray-500
                                    cursor-pointer
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                         v-model="property.isStatic" @change="flowStore.changesOccurred()">
                </li>
                <!-- Property setter & getter editing -->
                <li class="flex">
                  <label class="normal-case text-left w-16">Setter:</label>
                  <input type="checkbox"
                         class="bg-gray-500 rounded ml-1 my-auto px-2 h-5 w-5
                                    border border-gray-500
                                    cursor-pointer
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                         v-model="property.generateSetter" @change="flowStore.changesOccurred()">

                  <label class="normal-case text-left w-16 ml-auto">Getter:</label>
                  <input type="checkbox"
                         class="bg-gray-500 rounded ml-1 my-auto px-2 h-5 w-5
                                    border border-gray-500
                                    cursor-pointer
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                         v-model="property.generateGetter" @change="flowStore.changesOccurred()">
                </li>
              </ul>
            </div>
          </details>
        </li>
      </ul>
    </div>
  </details>

  <!-- Methods controls -->
  <details class="bg-inherit duration-300 border-b-4 border-gray-900">
    <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Methods</summary>
    <div class="hover:bg-gray-400 py-2 border-b border-gray-900 cursor-pointer" @click="addMethod">
      <font-awesome-icon icon="fa-plus fa-solid" color="white" />
    </div>
    <div class="py-2">
      <ul>
        <li v-for="(method, methodIndex) in selectedNodeData.classData.methods" :key="method.id">
          <details class="duration-300 text-white">
            <summary class="flex my-1">
              <font-awesome-icon icon="fa-solid fa-pen-to-square" color="white" class="my-auto cursor-pointer px-2"/>
              <div @click.prevent class="flex grow">
                <p class="grow text-white normal-case"> {{ method.name }} </p>
                <font-awesome-icon icon="fa-solid fa-xmark" color="red" class="my-auto cursor-pointer px-2"
                                   @click.prevent="removeMethod(`${methodIndex}`)"/>
              </div>
            </summary>
            <div class="mx-2 hover:shadow-lg hover:shadow-gray-500 border border-slate-600 hover:border-gray-500">
              <ul class="p-2 space-y-2">
                <!-- Method name editing -->
                <li class="flex">
                  <label class="normal-case w-16 text-left">Name:</label>
                  <input class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                         :value="method.name"
                         @keyup.enter="changeMethodName($event.target, method)"
                         @focusout="onMethodNameInputLostFocus($event.target, method)"
                  />
                </li>
                <!-- Method access editing -->
                <li class="flex">
                  <label class="normal-case text-left w-16">Access:</label>
                  <select class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                          v-model="method.accessModifier" @change="methodAccessChanged">
                    <option v-for="modifier in accessModifiers" :value="modifier">{{ modifier }}</option>
                  </select>
                </li>
                <!-- Method return type editing -->
                <li>
                  <div class="flex">
                    <label class="normal-case w-16 text-left">Return:</label>
                    <input type="text" list="method-return-data-types"
                           class="bg-gray-500 rounded ml-1 px-2 w-36
                                      border border-gray-500
                                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                           :value="method.returnType.name"
                           @keyup.enter="changeMethodReturnType($event.target, method)"
                           @focusout="onMethodReturnTypeInputLostFocus($event.target, method)"
                    />
                    <datalist id="method-return-data-types">
                      <option v-for="dataType in generalDataTypes">
                        {{ dataType }}
                      </option>
                      <option>void</option>
                    </datalist>
                  </div>
                  <!-- Type const check -->
                  <div class="flex">
                    <label class="normal-case text-left w-12">Const:</label>
                    <input type="checkbox"
                           class="bg-gray-500 rounded ml-2 my-auto px-2 h-5 w-5
                                      border border-gray-500
                                      cursor-pointer
                                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                           v-model="method.returnType.isConst" @change="flowStore.changesOccurred()">
                  </div>
                </li>
                <!-- Method return type pointer list -->
                <li class="flex">
                  <div class="ml-1">
                    <font-awesome-icon icon="fa-plus fa-solid" color="white" size="xs" class="cursor-pointer" @click="addPointer(method.returnType)"/>
                  </div>
                  <label class="normal-case text-left w-16">Pointers:</label>
                  <ul class="ml-10">
                    <li v-for="(pointer, pointerIdx) in method.returnType.pointerList" :key="pointer.id">
                      <label class="normal-case text-left w-16">const {{ pointerIdx }}:</label>
                      <input type="checkbox"
                             class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-5
                                        border border-gray-500
                                        cursor-pointer
                                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                             v-model="pointer.isConst" @change="flowStore.changesOccurred()">
                      <font-awesome-icon icon="fa-solid fa-xmark" color="red" class="my-auto cursor-pointer mx-2"
                                         @click.prevent="removePointer(method.returnType, pointerIdx)"/>
                    </li>
                  </ul>
                </li>
                <!-- Method virtual check -->
                <li class="flex">
                  <label class="normal-case text-left w-16">Virtual:</label>
                  <input type="checkbox"
                         class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-5
                                    border border-gray-500
                                    cursor-pointer
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                         v-model="method.isVirtual" @change="methodVirtualStatusChanged(method, $event.target.checked)">
                </li>
                <!-- Method static check -->
                <li class="flex">
                  <label class="normal-case text-left w-16">Static:</label>
                  <input type="checkbox"
                         class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-5
                                    border border-gray-500
                                    cursor-pointer
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                         v-model="method.isStatic" @change="methodStaticStatusChanged(method, $event.target.checked)">
                </li>
                <!-- Method parameters editing -->
                <li>
                  <div class="flex">
                    <label class="normal-case w-16 text-left">Param:</label>
                    <select class="bg-gray-500 focus:bg-white focus:text-black rounded ml-1 px-2 w-36 border border-gray-500"
                            v-model="method.selectedParameterID" :disabled="method.parameters.length === 0">
                      <option v-for="parameter in method.parameters" :value="parameter.id">{{ parameter.type.name }} {{ parameter.name }}</option>
                    </select>
                    <div class="ml-1">
                      <font-awesome-icon icon="fa-plus fa-solid" color="white" size="xs" class="cursor-pointer" @click="addParameter(method)"/>
                    </div>
                  </div>

                  <div v-if="method.selectedParameterID" class="ml-5 flex">
                    <ul class="p-2 space-y-2 list-disc grow">
                      <!-- Parameter name editing -->
                      <li class="flex">
                        <label class="normal-case text-left">Name:</label>
                        <input class="bg-gray-500 rounded ml-1 px-2 w-28
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                               :value="getSelectedParameterFromMethod(method).name"
                               @keyup.enter="changeMethodParameterName($event.target, method)"
                               @focusout="onMethodParameterNameInputLostFocus($event.target, method)"
                        />
                      </li>
                      <!-- Parameter type editing -->
                      <li class="flex">
                        <label class="normal-case text-left">Type:</label>
                        <input type="text" list="parameter-data-types"
                               class="bg-gray-500 rounded ml-1 px-2 w-28
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                               :value="getSelectedParameterFromMethod(method).type.name"
                               @keyup.enter="changeMethodParameterType($event.target, method)"
                               @focusout="onMethodParameterTypeInputLostFocus($event.target, method)"
                        />
                        <datalist id="parameter-data-types">
                          <option v-for="dataType in generalDataTypes">
                            {{ dataType }}
                          </option>
                        </datalist>
                      </li>
                      <!-- Parameter array dimension list -->
                      <li class="flex">
                        <div class="ml-1">
                          <font-awesome-icon icon="fa-plus fa-solid" color="white" size="xs" class="cursor-pointer"
                                             @click="addArrayDimension(getSelectedParameterFromMethod(method).type)"/>
                        </div>
                        <label class="normal-case text-left w-20">Array dimensions:</label>
                        <ul class="ml-5">
                          <li v-for="(dimension, dimensionIdx) in getSelectedParameterFromMethod(method).type.arrayDimensions"
                              :key="dimension.id" class="flex">
                            <div class="my-2">
                              <div class="flex">
                                <label class="normal-case text-left w-fit ml-2">Max len.:</label>
                                <input type="number"
                                       class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-20
                                      border border-gray-500
                                      cursor-pointer
                                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                       :value="dimension.maxLength" @focusout="maxDimensionLengthChanged(dimension, $event.target)" @keyup.enter="loseFocus">
                              </div>
                            </div>
                            <font-awesome-icon icon="fa-solid fa-xmark" color="red" class="my-auto cursor-pointer mx-2"
                                               @click="removeArrayDimension(getSelectedParameterFromMethod(method).type, dimensionIdx)"/>
                          </li>
                        </ul>
                      </li>
                      <!-- Parameter type pointer list -->
                      <li class="flex">
                        <div class="ml-1">
                          <font-awesome-icon icon="fa-plus fa-solid" color="white" size="xs" class="cursor-pointer" @click="addPointer(getSelectedParameterFromMethod(method).type)"/>
                        </div>
                        <label class="normal-case text-left w-fit">Pointers:</label>
                        <ul class="ml-10">
                          <li v-for="(pointer, pointerIdx) in getSelectedParameterFromMethod(method).type.pointerList" :key="pointer.id">
                            <label class="normal-case text-left w-16">const {{ pointerIdx }}:</label>
                            <input type="checkbox"
                                   class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-5
                                        border border-gray-500
                                        cursor-pointer
                                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                   v-model="pointer.isConst" @change="flowStore.changesOccurred()">
                            <font-awesome-icon icon="fa-solid fa-xmark" color="red" class="my-auto cursor-pointer mx-2"
                                               @click.prevent="removePointer(getSelectedParameterFromMethod(method).type, pointerIdx)"/>
                          </li>
                        </ul>
                      </li>
                      <!-- Parameter const & ref check -->
                      <li class="flex">
                        <label class="normal-case text-left w-12">Const:</label>
                        <input type="checkbox"
                               class="bg-gray-500 rounded ml-2 my-auto px-2 h-5 w-5
                                    border border-gray-500
                                    cursor-pointer
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                               v-model="getSelectedParameterFromMethod(method).type.isConst" @change="flowStore.changesOccurred()">

                        <label class="normal-case text-left w-8 ml-5">Ref:</label>
                        <input type="checkbox"
                               class="bg-gray-500 rounded ml-2 my-auto px-2 h-5 w-5
                                    border border-gray-500
                                    cursor-pointer
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                               v-model="getSelectedParameterFromMethod(method).isRef" @change="flowStore.changesOccurred()">
                      </li>
                    </ul>
                    <font-awesome-icon icon="fa-solid fa-trash" color="red" class="cursor-pointer my-auto ml-2" @click="removeSelectedParameter(method)"/>
                  </div>
                </li>
              </ul>
            </div>
          </details>
        </li>
      </ul>
    </div>
  </details>

  <!-- Inheritance controls -->
  <details class="bg-inherit duration-300 border-b-4 border-gray-900">
    <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Inherited</summary>
    <div class="py-2 text-white normal-case">
      <ul>
        <li v-for="parentClassNode in selectedNodeData.parentClassNodes" :key="parentClassNode.id">
          <div @click.prevent class="flex grow">
            <p class="grow">{{ findNode(parentClassNode.id).label }}</p>
          </div>
          <label class="normal-case text-left w-16">Access:</label>
          <select class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  v-model="parentClassNode.accessSpecifier" @change="flowStore.changesOccurred()">
            <option v-for="modifier in accessModifiers" :value="modifier">{{ modifier }}</option>
          </select>
        </li>
      </ul>
    </div>
  </details>

  <!-- Inheritance controls -->
  <details class="bg-inherit duration-300 border-b-4 border-gray-900">
    <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Friends</summary>
    <div class="py-2 text-white normal-case">
      <ul>
        <li v-for="classNode in getClassNodes()" :key="classNode.id">
          <div class="flex mr-auto w-fit">
            <input type="checkbox"
                   class="bg-gray-500 rounded mr-3 my-auto px-2 h-5 w-5
                            border border-gray-500
                            cursor-pointer
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                   :checked="selectedNodeData.classData.friendClassesIds.find(classId => classId === classNode.id) !== undefined"
                   @change="friendClassStatusChanged(classNode, $event.target.checked)">
            <label>{{ classNode.label }}</label>
          </div>
        </li>
      </ul>
    </div>
  </details>
</template>

<script setup>
import {v4 as uuidv4} from "uuid";
import { useVueFlow } from "@vue-flow/core";
import { useFlowStore } from "@/stores/flow.js";
import { checkNameValidity, accessModifiers, loseFocus } from "@/Utility/Utility.js";
import {toRef} from "vue";
import {nodeTypes} from "@/components/nodes/NodeUtil.js";

const { findNode, getSelectedNodes, removeNodes, getNodes } = useVueFlow();
const flowStore = useFlowStore();
const props = defineProps(["selectedNodeData"]);
const emits = defineEmits(["warning"]);
const selectedNodeData =  toRef(props, "selectedNodeData");

const generalDataTypes = ["int", "signed int", "unsigned int", "short int", "unsigned short int",
  "long int", "unsigned long int", "long long int", "unsigned long long int", "long",
  "float", "double", "long double", "bool",
  "char", "signed char", "unsigned char", "wchar_t",
  "std::string"];


// ****** General class functions ******
function changeClassName(inputElement) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    selectedNodeData.value.classData.name = inputElement.value;
    getSelectedNodes.value[0].label = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");

    // Change the save state of the flow
    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onClassNameInputLostFocus(inputElement) {
  // Save changes
  changeClassName(inputElement);

  // If the input at the time of focus lost is not valid, we need to
  // give the input value the value of the actual property
  inputElement.value = selectedNodeData.value.classData.name;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}


// ****** Class constructors functions ******
function addConstructor() {
  const newConstructor = {
    id: uuidv4(),
    name: "newConstructor",
    initializedFieldsIDs: [],
  };
  selectedNodeData.value.classData.constructors.push(newConstructor);
  flowStore.changesOccurred();
}
function removeConstructor(constructorIndex) {
  selectedNodeData.value.classData.constructors.splice(constructorIndex, 1);
  flowStore.changesOccurred();
}
function changeConstructorName(inputElement, constructor) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    constructor.name = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");

    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onConstructorNameInputLostFocus(inputElement, constructor) {
  // Save changes
  changePropertyName(inputElement, constructor);

  // If the input at the time of focus lost is not valid, we need to
  // give the input value the value of the actual property
  inputElement.value = constructor.name;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}

// Called when a checkbox related to initializing a field in a constructor is checked or unchecked
// isFieldInitialized will be true if the checkbox was checked, so we add the field to the initialization list
// else, remove the field from the initialization list
function constructorFieldStatusChanged(constructor, field, isFieldInitialized) {
  if(isFieldInitialized)
    addFieldToConstructorInitializationList(constructor, field);
  else
    removeFieldFromConstructorInitializationList(constructor, field);
}
function addFieldToConstructorInitializationList(constructor, field) {
  constructor.initializedFieldsIDs.push(field.id);
  flowStore.changesOccurred();
}
function removeFieldFromConstructorInitializationList(constructor, field) {
  const fieldIdx = constructor.initializedFieldsIDs.indexOf(field.id);
  if(fieldIdx !== -1) {
    constructor.initializedFieldsIDs.splice(fieldIdx, 1);
    flowStore.changesOccurred();
  }
}
function updateConstructorsInitializationListsOnPropertyDelete(deletedProperty) {
  selectedNodeData.value.classData.constructors.forEach(constructor => removeFieldFromConstructorInitializationList(constructor, deletedProperty));
}

// Same as the constructors but for the destructor
function destructorFieldStatusChanged(field, isFieldDeleted) {
  if(isFieldDeleted)
    addFieldToDestructorDeletionList(field);
  else
    removeFieldFromDestructorDeletionList(field);
}
function addFieldToDestructorDeletionList(field) {
  selectedNodeData.value.classData.destructor.deletedFieldsIds.push(field.id);
  flowStore.changesOccurred();
}
function removeFieldFromDestructorDeletionList(field) {
  const fieldIdx = selectedNodeData.value.classData.destructor.deletedFieldsIds.indexOf(field.id);
  if(fieldIdx !== -1) {
    selectedNodeData.value.classData.destructor.deletedFieldsIds.splice(fieldIdx, 1);
    flowStore.changesOccurred();
  }
}
// If pointers were removed from a property, it is possible that the user had checked the property to be
// deleted in the destructor but the property no longer being eligible for deletion anymore
function updateDestructorAfterPropertyPointerRemoval(property) {
  if(property.type.pointerList.length === 0)
    removeFieldFromDestructorDeletionList(property);
}

// ****** Data types functions ******
function addPointer(type) {
  type.pointerList.push({
    id: uuidv4(),
    isConst: false,
    isArray: false,
    arrayLengthFieldName: "len",
  });
  flowStore.changesOccurred();
}
function removePointer(type, pointerIdx) {
  type.pointerList.splice(pointerIdx, 1);

  flowStore.changesOccurred();
}

function addArrayDimension(type) {
  type.arrayDimensions.push({
    id: uuidv4(),
    maxLength: 1,
    arrayLengthFieldName: "len",
  });
  flowStore.changesOccurred();
}
function removeArrayDimension(type, dimensionIdx) {
  type.arrayDimensions.splice(dimensionIdx, 1);

  flowStore.changesOccurred();
}

function arrayLengthFieldNameChanged(model, inputElement) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    model.arrayLengthFieldName = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");

    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onArrayLengthFieldNameFocusLost(model, inputElement) {
  // Save changes
  arrayLengthFieldNameChanged(model, inputElement);

  // If the input at the time of focus lost is not valid, we need to
  // give the input value the value of the actual property
  inputElement.value = model.arrayLengthFieldName;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}
function maxDimensionLengthChanged(model, inputElement) {
  const newNumberVal = parseInt(inputElement.value);
  if(newNumberVal && newNumberVal > 0) {
    model.maxLength = newNumberVal;
    flowStore.changesOccurred();
  }
  else
    inputElement.value = model.maxLength.toString();
}


// ****** Class properties functions ******
function addProperty() {
  const newProperty = {
    id: uuidv4(),
    name: "newProperty",
    accessModifier: "private",
    type: {
      name: "char",
      isConst: false,
      pointerList: [],
      arrayDimensions: [],
    },
    generateSetter: false,
    generateGetter: false,
    isStatic: false,
  };
  selectedNodeData.value.classData.properties.push(newProperty);
  flowStore.changesOccurred();
}
function removeProperty(propertyIndex) {
  updateConstructorsInitializationListsOnPropertyDelete(selectedNodeData.value.classData.properties[propertyIndex]);
  removeFieldFromDestructorDeletionList(selectedNodeData.value.classData.properties[propertyIndex]);
  selectedNodeData.value.classData.properties.splice(propertyIndex, 1);
  flowStore.changesOccurred();
}

// Called when the user presses 'enter' in a property name input field signaling that he wishes to change
// the property name
function changePropertyName(inputElement, property) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    property.name = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");

    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
// When the user leaves an input field we need to update the value
// to contain the name of the property (they may differ if the user tried to change to an invalid name
// or if the user simply clicked away without saving the changes)
function onPropertyNameInputLostFocus(inputElement, property) {
  // Save changes
  changePropertyName(inputElement, property);

  // If the input at the time of focus lost is not valid, we need to
  // give the input value the value of the actual property
  inputElement.value = property.name;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}
function changePropertyType(inputElement, property) {
  inputElement.value = inputElement.value.trim();
  if(generalDataTypes.includes(inputElement.value) || checkNameValidity(inputElement.value)) {
    property.type.name = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");

    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onPropertyTypeInputLostFocus(inputElement, property) {
  changePropertyType(inputElement, property);

  inputElement.value = property.type.name;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}


// When a new access modifier is selected for a property
function propertyAccessChanged() {
  flowStore.changesOccurred();
}

// ****** Class methods functions ******
function addMethod() {
  const newMethod = {
    id: uuidv4(),
    name: "newMethod",
    accessModifier: "private",
    returnType: {
      name: "char",
      isConst: false,
      pointerList: [],
      arrayDimensions: [],
    },
    parameters: [],
    isVirtual: false,
    isStatic: false,
    selectedParameterID: null,
  }
  selectedNodeData.value.classData.methods.push(newMethod);
  flowStore.changesOccurred();
}
function removeMethod(methodIndex) {
  selectedNodeData.value.classData.methods.splice(methodIndex, 1);
  flowStore.changesOccurred();
}

// Method name editing
function changeMethodName(inputElement, method) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    method.name = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");

    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onMethodNameInputLostFocus(inputElement, method) {
  // Save changes
  changeMethodName(inputElement, method);

  // If the input at the time of focus lost is not valid, we need to
  // give the input value the value of the actual method
  inputElement.value = method.name;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}

// When a new access modifier is selected for a method
function methodAccessChanged() {
  flowStore.changesOccurred();
}

// Method return type editing
function changeMethodReturnType(inputElement, method) {
  inputElement.value = inputElement.value.trim();
  if(generalDataTypes.includes(inputElement.value) || checkNameValidity(inputElement.value)) {
    method.returnType.name = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");
    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onMethodReturnTypeInputLostFocus(inputElement, method) {
  changeMethodReturnType(inputElement, method);

  inputElement.value = method.returnType.name;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}

// Checks for conflicts between static and virtual status of the method
function methodVirtualStatusChanged(method, newVirtualStatus) {
  if(method.isStatic && newVirtualStatus) {
    method.isVirtual = false;
    emits("warning", "Static methods cannot be virtual!");
  }
  else
    flowStore.changesOccurred();
}
function methodStaticStatusChanged(method, newStaticStatus) {
  if(method.isVirtual && newStaticStatus) {
    method.isStatic = false;
    emits("warning", "Virtual methods cannot be static!");
  }
  else
    flowStore.changesOccurred();
}

// Method parameters editing
function getSelectedParameterFromMethod(method) {
  return method.parameters.find(param => param.id === method.selectedParameterID);
}
function addParameter(method) {
  const newParameter = {
    id: uuidv4(),
    name: "newParameter",
    type: {
      name: "char",
      isConst: false,
      pointerList: [],
      arrayDimensions: [],
    },
    isRef: false,
  };
  method.parameters.push(newParameter);
  method.selectedParameterID = newParameter.id;
  flowStore.changesOccurred();
}
function removeSelectedParameter(method) {
  const parameterIndex = method.parameters.indexOf(getSelectedParameterFromMethod(method));
  if(parameterIndex !== -1) {
    method.parameters.splice(parameterIndex, 1);
    method.selectedParameterID = null;
    flowStore.changesOccurred();
  }
}

// Method parameter name editing
function changeMethodParameterName(inputElement, method) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    getSelectedParameterFromMethod(method).name = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");
    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onMethodParameterNameInputLostFocus(inputElement, method) {
  // Save changes
  changeMethodParameterName(inputElement, method);

  // If the input at the time of focus lost is not valid, we need to
  // give the input value the value of the actual method
  inputElement.value = getSelectedParameterFromMethod(method).name;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}

// Method parameter type editing
function changeMethodParameterType(inputElement, method) {
  inputElement.value = inputElement.value.trim();
  if(generalDataTypes.includes(inputElement.value) || checkNameValidity(inputElement.value)) {
    getSelectedParameterFromMethod(method).type.name = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");
    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onMethodParameterTypeInputLostFocus(inputElement, method) {
  // Save changes
  changeMethodParameterType(inputElement, method);

  // If the input at the time of focus lost is not valid, we need to
  // give the input value the value of the actual method
  inputElement.value = getSelectedParameterFromMethod(method).type.name;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}


// Friend classes editing
function getClassNodes() {
  return getNodes.value.filter(node => node.type === nodeTypes.classNode && node.id !== selectedNodeData.value.id);
}

function friendClassStatusChanged(targetClass, isFriend) {
  if(isFriend) {
    selectedNodeData.value.classData.friendClassesIds.push(targetClass.id);
    flowStore.changesOccurred();
  }
  else {
    const friendClassIdx = selectedNodeData.value.classData.friendClassesIds.indexOf(targetClass.id);
    if(friendClassIdx !== -1) {
      selectedNodeData.value.classData.friendClassesIds.splice(friendClassIdx, 1);
      flowStore.changesOccurred();
    }
  }
}
</script>
