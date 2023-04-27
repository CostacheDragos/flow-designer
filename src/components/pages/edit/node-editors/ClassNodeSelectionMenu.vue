<template>
  <!-- Name -->
  <details class="duration-300 text-white p-4">
    <summary class="flex">
      <font-awesome-icon icon="fa-solid fa-pen-to-square"
                         class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"/>
      <div class="flex grow" @click.prevent>
        <h1 class="grow my-auto normal-case">
          {{ selectedNodeData.classData.name }}
        </h1>
        <font-awesome-icon icon="fa-solid fa-trash"
                           class="my-auto cursor-pointer text-red-600 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                           @click="removeNodes([`${getSelectedNodes[0].id}`])"/>
      </div>
    </summary>
    <div class="mx-2">
      <ul class="p-2 space-y-2">
        <!-- Class name editing -->
        <li class="flex">
          <label class="normal-case text-left my-auto w-16">Name:</label>
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
  <div class="ml-4 mr-4 flex text-white border-t border-slate-700">
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-right" v-show="!submenusOpenStatus.constructorSubmenu"
                       @click="submenusOpenStatus.constructorSubmenu = !submenusOpenStatus.constructorSubmenu"/>
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-down" v-show="submenusOpenStatus.constructorSubmenu"
                       @click="submenusOpenStatus.constructorSubmenu = !submenusOpenStatus.constructorSubmenu"/>
    <h1 class="bg-inherit pl-2 py-3 text-lg normal-case">Constructors</h1>
  </div>
  <div class="ml-8 text-white normal-case" v-show="submenusOpenStatus.constructorSubmenu">
    <div class="flex w-fit mt-1">
      <label class="normal-case text-left w-48">Copy constructor: </label>
      <input type="checkbox"
             class="checkbox checkbox-sm my-auto border-white bg-white ml-1"
             v-model="selectedNodeData.classData.generateCopyConstructor">
    </div>
    <div class="flex w-fit mt-1">
      <label class="normal-case text-left w-48">Copy assign operator: </label>
      <input type="checkbox"
             class="checkbox checkbox-sm my-auto border-white bg-white ml-1"
             v-model="selectedNodeData.classData.generateCopyAssignOperator">
    </div>
    <div class="flex w-fit mt-1">
      <label class="normal-case text-left w-48">Add constructor: </label>
      <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white border border-slate-700
                          hover:bg-slate-700 hover:border-white rounded-2xl px-2 py-1 w-2.5"
                         icon="fa-plus fa-solid" @click="addConstructor"/>
    </div>
    <div class="flex w-fit mt-1">
      <label class="normal-case text-left w-48">Constructors: </label>
    </div>
    <div class="py-2">
      <label v-show="selectedNodeData.classData.constructors.length === 0">No constructors created</label>
      <ul class="ml-3">
        <li v-for="(constructor, constructorIndex) in selectedNodeData.classData.constructors" :key="constructor.id">
          <details class="duration-300 text-white" >
            <summary class="flex my-1">
              <font-awesome-icon icon="fa-solid fa-pen-to-square"
                                 class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"/>
              <div @click.prevent class="flex">
                <p class="text-white normal-case my-auto mx-4"> {{ constructor.name }} </p>
                <font-awesome-icon icon="fa-solid fa-xmark"
                                   class="my-auto cursor-pointer text-red-600 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                                   @click.prevent="removeConstructor(`${constructorIndex}`)"/>
              </div>
            </summary>
            <div class="mx-2 rounded-2xl border border-slate-600 hover:border-gray-500">
              <ul class="p-2 space-y-2">
                <!-- Constructor name editing -->
                <li class="flex">
                  <label class="normal-case text-left w-16">Label:</label>
                  <input class="bg-gray-500 rounded ml-1 px-2 w-52 text-center
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                         :value="constructor.name"
                         @keyup.enter="changeConstructorName($event.target, constructor)"
                         @focusout="onConstructorNameInputLostFocus($event.target, constructor)"
                  />
                </li>
                <!-- Constructor initialized fields editing -->
                <li>
                  <div class="flex">
                    <label>Fields to initialize:</label>
                  </div>
                  <div v-for="property in selectedNodeData.classData.properties" :key="property.id" class="flex ">
                    <input type="checkbox"
                           class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                           :checked="constructor.initializedFieldsIDs.find(fieldID => fieldID === property.id) !== undefined"
                           @change="constructorFieldStatusChanged(constructor, property, $event.target.checked)">
                    <label class="normal-case text-left w-40">{{ property.name }}</label>
                  </div>
                </li>
              </ul>
            </div>
          </details>
        </li>
      </ul>
    </div>
  </div>

  <!-- Destructor controls -->
  <div class="ml-4 mr-4 flex text-white border-t border-slate-700">
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-right" v-show="!submenusOpenStatus.destructorSubmenu"
                       @click="submenusOpenStatus.destructorSubmenu = !submenusOpenStatus.destructorSubmenu"/>
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-down" v-show="submenusOpenStatus.destructorSubmenu"
                       @click="submenusOpenStatus.destructorSubmenu = !submenusOpenStatus.destructorSubmenu"/>
    <h1 class="bg-inherit pl-2 py-3 text-lg normal-case">Destructor</h1>
  </div>
  <div class="ml-8 text-white normal-case" v-show="submenusOpenStatus.destructorSubmenu">
    <div class="flex w-fit py-2">
      <label class="normal-case text-left w-48 my-auto">Generate destructor: </label>
      <input type="checkbox"
             class="checkbox checkbox-sm my-auto border-white bg-white ml-1"
             v-model="selectedNodeData.classData.generateDestructor">
    </div>
    <div v-if="selectedNodeData.classData.generateDestructor" class="py-2 text-white normal-case">
      <p class="flex">Fields to be deleted:</p>
      <!-- Fields to be deleted by destructor -->
      <div v-for="property in selectedNodeData.classData.properties" :key="property.id" v-show="property.type.pointerList.length > 0"
           class="ml-5 flex">
        <input type="checkbox"
               class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
               :checked="selectedNodeData.classData.destructor.deletedFieldsIds.find(fieldID => fieldID === property.id) !== undefined"
               @change="destructorFieldStatusChanged(property, $event.target.checked)">
        <label class="normal-case text-left">{{ property.name }}</label>
      </div>
    </div>
  </div>

  <!-- Properties controls -->
  <div class="ml-4 mr-4 flex text-white border-t border-slate-700">
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-right" v-show="!submenusOpenStatus.propertiesSubmenu"
                       @click="submenusOpenStatus.propertiesSubmenu = !submenusOpenStatus.propertiesSubmenu"/>
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-down" v-show="submenusOpenStatus.propertiesSubmenu"
                       @click="submenusOpenStatus.propertiesSubmenu = !submenusOpenStatus.propertiesSubmenu"/>
    <h1 class="bg-inherit pl-2 py-3 text-lg normal-case">Properties</h1>
  </div>
  <div class="ml-8 text-white normal-case" v-show="submenusOpenStatus.propertiesSubmenu">
    <div class="flex w-fit mt-1">
      <label class="normal-case text-left w-32">Add property: </label>
      <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white border border-slate-700
                          hover:bg-slate-700 hover:border-white rounded-2xl px-2 py-1 w-2.5"
                         icon="fa-plus fa-solid" @click="addProperty"/>
    </div>
    <div class="py-2">
      <ul>
        <li v-for="(property, propertyIndex) in selectedNodeData.classData.properties" :key="property.id">
          <details class="duration-300 text-white" >
            <summary class="flex my-1">
              <font-awesome-icon icon="fa-solid fa-pen-to-square"
                                 class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"/>
              <div @click.prevent class="flex">
                <p class="text-white normal-case my-auto mx-4"> {{ property.name }} </p>
                <font-awesome-icon icon="fa-solid fa-xmark"
                                   class="my-auto cursor-pointer text-red-600 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                                   @click.prevent="removeProperty(`${propertyIndex}`)"/>
              </div>
            </summary>
            <div class="mx-2 rounded-2xl border border-slate-600 hover:border-gray-500">
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
                <!-- Property setter editing -->
                <li class="flex">
                  <label class="normal-case text-left w-16">Setter:</label>
                  <input type="checkbox"
                         class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                         v-model="property.generateSetter" @change="flowStore.changesOccurred()">
                </li>
                <!-- Property getter editing -->
                <li class="flex">
                  <label class="normal-case text-left w-16">Getter:</label>
                  <input type="checkbox"
                         class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                         v-model="property.generateGetter" @change="flowStore.changesOccurred()">
                </li>
                <!-- Property static check -->
                <li class="flex">
                  <label class="normal-case text-left w-16">Static:</label>
                  <input type="checkbox"
                         class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                         v-model="property.isStatic" @change="flowStore.changesOccurred()">
                </li>
                <!-- Property type editing -->
                <li>
                  <div class="mt-5 flex">
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
                      <option v-for="classNode in getClassNodes()">
                        {{ classNode.label }}
                      </option>
                      <option>
                        {{ selectedNodeData.classData.name }}
                      </option>
                    </datalist>
                  </div>
                  <!-- Type const check -->
                  <div class="flex ml-5">
                    <label class="normal-case text-left w-16">Const:</label>
                    <input type="checkbox"
                           class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                           v-model="property.type.isConst" @change="flowStore.changesOccurred()">
                  </div>
                </li>
                <!-- Property array dimension list -->
                <li class="ml-5">
                  <div class="flex">
                    <label class="normal-case text-left w-40">Array dimensions:</label>
                    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white border border-slate-700
                            hover:bg-slate-700 hover:border-white rounded-2xl px-2 py-1 w-2.5"
                                       icon="fa-plus fa-solid" @click="addArrayDimension(property.type)"/>
                  </div>
                  <ul class="ml-5">
                    <li v-for="(dimension, dimensionIdx) in property.type.arrayDimensions" :key="dimension.id"
                        class="flex rounded border border-slate-600 my-1">
                      <div class="my-2">
                        <div class="flex">
                          <label class="ml-1 normal-case text-left w-44">Length field name:</label>
                          <input type="text"
                                 class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-28 text-center
                                              border border-gray-500
                                              cursor-pointer
                                              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                 :value="dimension.arrayLengthFieldName" @change="arrayLengthFieldNameChanged(dimension, $event.target)"
                                 @focusout="onArrayLengthFieldNameFocusLost(dimension, $event.target)">
                        </div>
                        <div class="flex">
                          <label class="ml-1 normal-case text-left w-44">Max length:</label>
                          <input type="number"
                                 class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-28 text-center
                                              border border-gray-500
                                              cursor-pointer
                                              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                 :value="dimension.maxLength" @focusout="maxDimensionLengthChanged(dimension, $event.target)" @keyup.enter="loseFocus">
                        </div>
                      </div>
                      <font-awesome-icon icon="fa-solid fa-xmark"
                                         class="my-auto ml-auto mr-1
                                          cursor-pointer text-red-600 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-3"
                                         @click="removeArrayDimension(property.type, dimensionIdx)"/>
                    </li>
                  </ul>
                </li>
                <!-- Property type pointer list -->
                <li class="ml-5">
                  <div class="flex">
                    <label class="normal-case text-left w-24">Pointers:</label>
                    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white border border-slate-700
                            hover:bg-slate-700 hover:border-white rounded-2xl px-2 py-1 w-2.5"
                                       icon="fa-plus fa-solid" @click="addPointer(property.type)"/>
                  </div>
                  <ul class="ml-5">
                    <li v-for="(pointer, pointerIdx) in property.type.pointerList" :key="pointer.id"
                        class="flex rounded border border-slate-600 my-1">
                      <div class="my-2">
                        <div class="ml-1 w-fit">
                          <label class="normal-case text-left w-16">Pointer No.: {{pointerIdx}}</label>
                        </div>
                        <div class="ml-1 w-fit">
                          <label class="normal-case text-left w-16">Const:</label>
                          <input type="checkbox"
                                 class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                                 v-model="pointer.isConst" @change="flowStore.changesOccurred()">
                        </div>
                        <div class="ml-1 w-fit">
                          <label class="normal-case text-left w-16">Array:</label>
                          <input type="checkbox"
                                 class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                                 v-model="pointer.isArray" @change="flowStore.changesOccurred()">
                        </div>
                        <div v-show="pointer.isArray" class="w-fit">
                          <label class="ml-1 normal-case text-left w-44">Length field name:</label>
                          <input type="text"
                                 class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-28 text-center
                                              border border-gray-500
                                              cursor-pointer
                                              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                 :value="pointer.arrayLengthFieldName" @change="arrayLengthFieldNameChanged(pointer, $event.target)"
                                 @focusout="onArrayLengthFieldNameFocusLost(pointer, $event.target)">
                        </div>
                      </div>
                      <font-awesome-icon icon="fa-solid fa-xmark" class="my-auto ml-auto mr-1
                                          cursor-pointer text-red-600 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-3"
                                         @click="removePointer(property.type, pointerIdx), updateDestructorAfterPropertyPointerRemoval(property)"/>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </details>
        </li>
      </ul>
    </div>
  </div>

  <!-- Methods controls -->
  <div class="ml-4 mr-4 flex text-white border-t border-slate-700">
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-right" v-show="!submenusOpenStatus.methodsSubmenu"
                       @click="submenusOpenStatus.methodsSubmenu = !submenusOpenStatus.methodsSubmenu"/>
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-down" v-show="submenusOpenStatus.methodsSubmenu"
                       @click="submenusOpenStatus.methodsSubmenu = !submenusOpenStatus.methodsSubmenu"/>
    <h1 class="bg-inherit pl-2 py-3 text-lg normal-case">Methods</h1>
  </div>
  <div class="ml-8 text-white normal-case" v-show="submenusOpenStatus.methodsSubmenu">
    <div class="flex w-fit mt-1">
      <label class="normal-case text-left w-32">Add method: </label>
      <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white border border-slate-700
                          hover:bg-slate-700 hover:border-white rounded-2xl px-2 py-1 w-2.5"
                         icon="fa-plus fa-solid" @click="addMethod"/>
    </div>
    <div class="py-2">
      <ul>
        <li v-for="(method, methodIndex) in selectedNodeData.classData.methods" :key="method.id">
          <details class="duration-300 text-white">
            <summary class="flex my-1">
              <font-awesome-icon icon="fa-solid fa-pen-to-square"
                                 class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"/>
              <div @click.prevent class="flex">
                <p class="text-white normal-case my-auto mx-4"> {{ method.name }} </p>
                <font-awesome-icon icon="fa-solid fa-xmark"
                                   class="my-auto cursor-pointer text-red-600 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                                   @click.prevent="removeMethod(`${methodIndex}`)"/>
              </div>
            </summary>
            <div class="mx-2 rounded-2xl border border-slate-600 hover:border-gray-500">
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
                <!-- Method virtual check -->
                <li class="flex">
                  <label class="normal-case text-left w-16">Virtual:</label>
                  <input type="checkbox"
                         class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                         v-model="method.isVirtual" @change="methodVirtualStatusChanged(method, $event.target.checked)">
                </li>
                <!-- Method static check -->
                <li class="flex">
                  <label class="normal-case text-left w-16">Static:</label>
                  <input type="checkbox"
                         class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                         v-model="method.isStatic" @change="methodStaticStatusChanged(method, $event.target.checked)">
                </li>
                <!-- Method return type editing -->
                <li>
                  <div class="flex mt-5">
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
                  <div class="flex ml-5">
                    <label class="normal-case text-left w-16">Const:</label>
                    <input type="checkbox"
                           class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                           v-model="method.returnType.isConst" @change="flowStore.changesOccurred()">
                  </div>
                </li>
                <!-- Method return type pointer list -->
                <li class="ml-5">
                  <div class="flex">
                    <label class="normal-case text-left w-24">Pointers:</label>
                    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white border border-slate-700
                            hover:bg-slate-700 hover:border-white rounded-2xl px-2 py-1 w-2.5"
                                       icon="fa-plus fa-solid" @click="addPointer(method.returnType)"/>
                  </div>
                  <ul class="ml-5">
                    <li v-for="(pointer, pointerIdx) in method.returnType.pointerList" :key="pointer.id"
                        class="flex rounded border border-slate-600 my-1">
                      <div class="my-2">
                        <div class="ml-1 w-fit">
                          <label class="normal-case text-left w-16">Pointer No.: {{pointerIdx}}</label>
                        </div>
                        <div class="ml-1 w-fit">
                          <label class="normal-case text-left w-16">Const:</label>
                          <input type="checkbox"
                                 class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                                 v-model="pointer.isConst" @change="flowStore.changesOccurred()">
                        </div>
                      </div>
                      <font-awesome-icon icon="fa-solid fa-xmark" class="my-auto ml-auto mr-1
                                          cursor-pointer text-red-600 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-3"
                                         @click.prevent="removePointer(method.returnType, pointerIdx)"/>
                    </li>
                  </ul>
                </li>
                <!-- Method parameters editing -->
                <li>
                  <div class="flex mt-5">
                    <label class="normal-case text-left w-36">Add Parameter:</label>
                    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white border border-slate-700
                            hover:bg-slate-700 hover:border-white rounded-2xl px-2 py-1 w-2.5"
                            icon="fa-plus fa-solid" @click="addParameter(method)"/>
                  </div>
                  <div class="flex mt-1">
                    <label class="normal-case text-left w-36 my-auto">Edit Parameter:</label>
                    <select class="bg-gray-500 focus:bg-white focus:text-black rounded ml-1 px-2 w-48 text-center border border-gray-500"
                            v-model="method.selectedParameterID" :disabled="method.parameters.length === 0">
                      <option v-for="parameter in method.parameters" :value="parameter.id">{{ parameter.name }}</option>
                    </select>
                    <font-awesome-icon icon="fa-solid fa-xmark" class="my-auto ml-2
                                          cursor-pointer text-red-600 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-3"
                                       @click="removeSelectedParameter(method)"/>
                  </div>
                  <div v-if="method.selectedParameterID" class="ml-5 flex">
                    <ul class="p-2 space-y-2 list-disc grow">
                      <!-- Parameter name editing -->
                      <li class="flex">
                        <label class="normal-case text-left w-16">Name:</label>
                        <input class="bg-gray-500 rounded ml-1 px-2 w-44
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                               :value="getSelectedParameterFromMethod(method).name"
                               @keyup.enter="changeMethodParameterName($event.target, method)"
                               @focusout="onMethodParameterNameInputLostFocus($event.target, method)"
                        />
                      </li>
                      <!-- Parameter type editing -->
                      <li class="flex">
                        <label class="normal-case text-left w-16">Type:</label>
                        <input type="text" list="parameter-data-types"
                               class="bg-gray-500 rounded ml-1 px-2 w-44
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
                      <!-- Parameter Type const check -->
                      <li class="flex ml-5">
                        <label class="normal-case text-left w-16">Const:</label>
                        <input type="checkbox"
                               class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                               v-model="getSelectedParameterFromMethod(method).type.isConst" @change="flowStore.changesOccurred()">
                      </li>
                      <!-- Parameter Type ref check -->
                      <li class="flex ml-5">
                        <label class="normal-case text-left w-16">Ref:</label>
                        <input type="checkbox"
                               class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                               v-model="getSelectedParameterFromMethod(method).type.isRef" @change="flowStore.changesOccurred()">
                      </li>
                      <!-- Parameter array dimension list -->
                      <li class="list-none ml-5">
                        <div class="flex">
                          <label class="normal-case text-left w-40">Array dimensions:</label>
                          <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white border border-slate-700
                            hover:bg-slate-700 hover:border-white rounded-2xl px-2 py-1 w-2.5"
                                             icon="fa-plus fa-solid" @click="addArrayDimension(getSelectedParameterFromMethod(method).type)"/>
                        </div>
                        <ul class="ml-5">
                          <li v-for="(dimension, dimensionIdx) in getSelectedParameterFromMethod(method).type.arrayDimensions"
                              :key="dimension.id" class="flex rounded border border-slate-600 my-1">
                            <div class="my-2">
                              <div class="flex">
                                <label class="normal-case text-left w-fit ml-2">Max length:</label>
                                <input type="number"
                                       class="bg-gray-500 rounded ml-3 my-auto px-2 h-5 w-20
                                      border border-gray-500
                                      cursor-pointer
                                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                       :value="dimension.maxLength" @focusout="maxDimensionLengthChanged(dimension, $event.target)" @keyup.enter="loseFocus">
                              </div>
                            </div>
                            <font-awesome-icon icon="fa-solid fa-xmark" class="my-auto ml-auto mr-1
                                               cursor-pointer text-red-600 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-3"
                                               @click="removeArrayDimension(getSelectedParameterFromMethod(method).type, dimensionIdx)"/>
                          </li>
                        </ul>
                      </li>
                      <!-- Parameter type pointer list -->
                      <li class="list-none ml-5">
                        <div class="flex">
                          <label class="normal-case text-left w-24">Pointers:</label>
                          <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white border border-slate-700
                            hover:bg-slate-700 hover:border-white rounded-2xl px-2 py-1 w-2.5"
                                             icon="fa-plus fa-solid" @click="addPointer(getSelectedParameterFromMethod(method).type)"/>
                        </div>
                        <ul class="ml-10">
                          <li v-for="(pointer, pointerIdx) in getSelectedParameterFromMethod(method).type.pointerList" :key="pointer.id"
                              class="flex rounded border border-slate-600 my-1">
                            <div class="my-2">
                              <div class="ml-1 w-fit">
                                <label class="normal-case text-left w-16">Pointer No.: {{pointerIdx}}</label>
                              </div>
                              <div class="ml-1 w-fit">
                                <label class="normal-case text-left w-16">Const:</label>
                                <input type="checkbox"
                                       class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                                       v-model="pointer.isConst" @change="flowStore.changesOccurred()">
                              </div>
                            </div>
                            <font-awesome-icon icon="fa-solid fa-xmark" class="my-auto ml-auto mr-1
                                          cursor-pointer text-red-600 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-3"
                                               @click.prevent="removePointer(getSelectedParameterFromMethod(method).type, pointerIdx)"/>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </details>
        </li>
      </ul>
    </div>
  </div>

  <!-- Inheritance controls -->
  <div class="ml-4 mr-4 flex text-white border-t border-slate-700">
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-right" v-show="!submenusOpenStatus.inheritanceSubmenu"
                       @click="submenusOpenStatus.inheritanceSubmenu = !submenusOpenStatus.inheritanceSubmenu"/>
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-down" v-show="submenusOpenStatus.inheritanceSubmenu"
                       @click="submenusOpenStatus.inheritanceSubmenu = !submenusOpenStatus.inheritanceSubmenu"/>
    <h1 class="bg-inherit pl-2 py-3 text-lg normal-case">Inherited</h1>
  </div>
  <div class="ml-8 text-white normal-case" v-show="submenusOpenStatus.inheritanceSubmenu">
    <div class="py-2 text-white normal-case">
      <ul>
        <li v-for="parentClassNode in selectedNodeData.parentClassNodes" :key="parentClassNode.id"
            class="rounded border border-slate-600 my-1 p-2">
          <div class="flex">
            <p>Inherited class name: {{ findNode(parentClassNode.id).label }}</p>
          </div>
          <div class="flex">
            <label class="normal-case text-left w-16">Access:</label>
            <select class="bg-gray-500 rounded ml-1 px-2 w-36
                                      border border-gray-500
                                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    v-model="parentClassNode.accessSpecifier" @change="flowStore.changesOccurred()">
              <option v-for="modifier in accessModifiers" :value="modifier">{{ modifier }}</option>
            </select>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <!-- Friends controls -->
  <div class="ml-4 mr-4 flex text-white border-t border-slate-700">
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-right" v-show="!submenusOpenStatus.friendsSubmenu"
                       @click="submenusOpenStatus.friendsSubmenu = !submenusOpenStatus.friendsSubmenu"/>
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-down" v-show="submenusOpenStatus.friendsSubmenu"
                       @click="submenusOpenStatus.friendsSubmenu = !submenusOpenStatus.friendsSubmenu"/>
    <h1 class="bg-inherit pl-2 py-3 text-lg normal-case">Friends</h1>
  </div>
  <div class="ml-8 text-white normal-case" v-show="submenusOpenStatus.friendsSubmenu">
    <ul>
      <li v-for="classNode in getClassNodes()" :key="classNode.id">
        <div class="flex mr-auto w-fit">
          <input type="checkbox"
                 class="checkbox checkbox-sm my-auto border-white bg-white mx-3"
                 :checked="selectedNodeData.classData.friendClassesIds.find(classId => classId === classNode.id) !== undefined"
                 @change="friendClassStatusChanged(classNode, $event.target.checked)">
          <label>{{ classNode.label }}</label>
        </div>
      </li>
    </ul>
  </div>

  <!-- Template controls -->
  <div class="ml-4 mr-4 flex text-white border-t border-slate-700">
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-right" v-show="!submenusOpenStatus.templateSubmenu"
                       @click="submenusOpenStatus.templateSubmenu = !submenusOpenStatus.templateSubmenu"/>
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-down" v-show="submenusOpenStatus.templateSubmenu"
                       @click="submenusOpenStatus.templateSubmenu = !submenusOpenStatus.templateSubmenu"/>
    <h1 class="bg-inherit pl-2 py-3 text-lg normal-case">Template</h1>
  </div>
  <div class="ml-8 text-white normal-case" v-show="submenusOpenStatus.templateSubmenu">
    <div class="flex text-white">
      <label class="normal-case text-left w-32">Is Template: </label>
      <input type="checkbox"
             class="checkbox checkbox-sm my-auto border-white bg-white mx-1"
             v-model="selectedNodeData.classData.isTemplate">
    </div>
    <div class="flex w-fit mt-1">
      <label class="normal-case text-left w-32">Add typename: </label>
      <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white border border-slate-700
                          hover:bg-slate-700 hover:border-white rounded-2xl px-2 py-1 w-2.5"
                         icon="fa-plus fa-solid" @click="addTemplateTypeName"/>
    </div>
    <ul v-if="selectedNodeData.classData.isTemplate" class="text-white normal-case">
      <li v-for="(typename, typenameIdx) in selectedNodeData.classData.TemplateTypesData" :key="typename.id"
          class="flex rounded border border-slate-600 my-1 p-1">
        <label class="normal-case text-left w-16 my-auto">Name:</label>
        <input class="bg-gray-500 rounded px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
               :value="typename.name"
               @keyup.enter="changeTemplateTypename($event.target, typename)"
               @focusout="onTemplateTypenameInputLostFocus($event.target, typename)"
        />
        <font-awesome-icon icon="fa-solid fa-xmark" class="my-auto ml-auto mr-1
                                          cursor-pointer text-red-600 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-3"
                           @click.prevent="removeTypename(`${typenameIdx}`)"/>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {v4 as uuidv4} from "uuid";
import { useVueFlow } from "@vue-flow/core";
import { useFlowStore } from "@/stores/flow.js";
import { checkNameValidity, accessModifiers, loseFocus } from "@/Utility/Utility.js";
import {reactive, toRef} from "vue";
import {nodeTypes} from "@/components/nodes/NodeUtil.js";

const { findNode, getSelectedNodes, removeNodes, getNodes } = useVueFlow();
const flowStore = useFlowStore();
const props = defineProps(["selectedNodeData"]);
const emits = defineEmits(["warning", "associateClasses", "removeClassAssociation"]);
const selectedNodeData =  toRef(props, "selectedNodeData");

const generalDataTypes = ["int", "signed int", "unsigned int", "short int", "unsigned short int",
  "long int", "unsigned long int", "long long int", "unsigned long long int", "long",
  "float", "double", "long double", "bool",
  "char", "signed char", "unsigned char", "wchar_t",
  "std::string"];

const submenusOpenStatus = reactive({
  constructorSubmenu: false,
  destructorSubmenu: false,
  propertiesSubmenu: false,
  methodsSubmenu: false,
  inheritanceSubmenu: false,
  friendsSubmenu: false,
  templateSubmenu: false,
});

// ****** General class functions ******
function changeClassName(inputElement) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    const oldName = selectedNodeData.value.classData.name;

    selectedNodeData.value.classData.name = inputElement.value;
    getSelectedNodes.value[0].label = inputElement.value;

    updateAssociatedPropertiesOnClassRename(oldName);

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

function updateAssociationOnPropertyChanged(property) {
  // Check if the property type matches any class
  const associatedClassNode = getClassNodes().find(classNode => classNode.label === property.type.name);
  if(associatedClassNode !== undefined) {
    // If it does, check if any of the other properties of the selected node match this same class
    // if not, remove the association edge
    if(selectedNodeData.value.classData.properties.find(currentProp =>
        currentProp.id !== property.id && currentProp.type.name === associatedClassNode.label) === undefined) {
      emits("removeClassAssociation", selectedNodeData.value.id, associatedClassNode.id);
    }
  }
}
// When the name of the class changes, we need to find any reference to it in other classes
// properties and alter the type name
function updateAssociatedPropertiesOnClassRename(oldName) {
  getClassNodes().forEach(classNode => {
    classNode.data.classData.properties.forEach(property => {
      if(property.type.name === oldName)
        property.type.name = selectedNodeData.value.classData.name;
    });
  });
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
  updateAssociationOnPropertyChanged(selectedNodeData.value.classData.properties[propertyIndex]);
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
  if(inputElement.value !== property.type.name && (generalDataTypes.includes(inputElement.value) || checkNameValidity(inputElement.value))) {
    updateAssociationOnPropertyChanged(property);

    property.type.name = inputElement.value;

    // If the new type indicates another class, emit the association event in order for the association line to be drawn
    const otherClassNode = getClassNodes().find(classNode => classNode.label === property.type.name);
    if(otherClassNode !== undefined)
      emits("associateClasses", selectedNodeData.value.id, otherClassNode.id);

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
      isRef: false,
    },
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


// Template class data editing
function addTemplateTypeName() {
  selectedNodeData.value.classData.TemplateTypesData.push({
    id: uuidv4(),
    name: "T",
  });
  flowStore.changesOccurred();
}
function removeTypename(typenameIdx) {
  selectedNodeData.value.classData.TemplateTypesData.splice(typenameIdx, 1);
  flowStore.changesOccurred();
}
function changeTemplateTypename(inputElement, typename) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    typename.name = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");

    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onTemplateTypenameInputLostFocus(inputElement, typename) {
  // Save changes
  changeTemplateTypename(inputElement, typename);

  // If the input at the time of focus lost is not valid, we need to
  // give the input value the value of the actual method
  inputElement.value = typename.name;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}

</script>
