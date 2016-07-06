//{
//  "objects": [
//    { "id" : 0, "name" : "Object 1" }
//    { "id" : 1, "name" : "Object 2" }
//    { "id" : 2, "name" : "Object 3" }
//  ]
//}
var objects = {};
var addObject = function(objectData) {
  objects[objectData._id] = objectData;
  localStorage.setItem('objects', JSON.stringify(objects));
};
var print = function print(ob) {
  console.log(JSON.stringify(ob, null, 2));
}
var tryParsingJSON = function(text) {
  try {
    var json = JSON.parse(text);
    return json
  } catch (e) {
    throw e;
  }
};
var getDictFromForm = function(form) {
  var fd = new FormData(form);
  var entries = {};
  for(var elem of fd.entries()) {
    entries[elem[0]] = elem[1];
  }
  return entries;
}
var getFormFromDict = function(dict) {
  var fd = new FormData;
  for(var elem in dict) {
    fd.append(elem, dict[elem]);
  }
  return fd;
};
var validateForm = function(form) {
  return new Promise(function(resolve, reject) {
    //return fd;
    var entries = getDictFromForm(form);
    if(entries.name !== "") {
      return resolve(getFormFromDict(entries));
    }
    return reject();
  });
};
var xhr = function(url, method, data) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open(method, url, true);
    req.onload = function() {
      console.log('loaded');
      return resolve(req);
    };
    req.onerror = function(e) {
      return reject(e);
    };
    req.send(data);
  });
};

var clearLocalStorage = function() {
  while(localStorage.length) {
    let key = localStorage.key(0);
    console.log('removing key: ' + key);
    localStorage.removeItem(key);
  }
}

var submitForm = xhr;
var objectForm = document.getElementById('object-form');

(function() {
  var rname = randomName();
  var setName = function(first, last) {
    objectForm.querySelector('[name=name\\[first\\]]').value = first;
    objectForm.querySelector('[name=name\\[last\\]]').value = last;
  }
  setName.apply(this, rname);

  clearLocalStorage();

  objectForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let form = e.target;
    validateForm(form).then(function(formData) {
      return submitForm(
        form.action || '/'
        , form.method || 'POST'
        , formData
      );
    }).then(function(result) {
      var j = tryParsingJSON(result.responseText);
      addOrModifyObject(j);
    }).catch(function(err) {
      console.log('failure');
      throw err;
    }).then(function() {
      setName.apply(this, randomName());
    });
  });

  window.addEventListener('storage', function(e) {
    var oldValue = JSON.parse(e.oldValue);
    var newValue = JSON.parse(e.newValue);
    if(e.key === 'objects') {
      var bothObjects = typeof oldValue === 'object' && typeof newValue === 'object';
      if(bothObjects && oldValue !== null && newValue !== null) {
        var sameVals = Object.keys(newValue)
          .filter((el)=>oldValue.hasOwnProperty(el)); // modified (maybe)
        var newVals = Object.keys(newValue)
          .filter((el)=>sameVals.indexOf(el) < 0).map((el)=>newValue[el]); // added
        var oldVals = Object.keys(oldValue)
          .filter((el)=>!newValue.hasOwnProperty(el)) // removed
        var changedVals = sameVals
          .map((el, i)=>oldValue[el].version !== newValue[el].version ? i : false)
          .filter((el)=>el !== false); // changed
        newVals.forEach((el)=>renderObject(el));
      } else if (bothObjects && oldValue === null && newValue !== null) {
        for(var prop in newValue) {
          if(newValue.hasOwnProperty(prop)) renderObject(newValue[prop])
        }
        // oldvalue not present
      } else if (bothObjects && oldValue !== null && newValue === null) {
          // newvalue deleted entirely
      } else {
        // shouldn't happen
        throw new Error('malformed localStorage');
      }
    }
  });
})();

var objectContainer = document.getElementById('object-container');

var addOrModifyObject = function(objectData) {
  print(objects);
  if(objects.hasOwnProperty(objectData._id)){
    objectData.version++;
  }
  addObject(objectData);
  updateRender();
};

var updateRender = function() {
  var children = [].slice.call(objectContainer.children, 0).map((el)=>el.getAttribute('_id'));
  for(var key in objects) {
    if(children.indexOf(key) < 0) renderObject(objects[key]);
  }
};

var renderObject = function(objectData) {
  var html = window["Templates"]["templates/object"](objectData);
  var existingEl = document.querySelector('[_id="' + objectData._id + '"]');
  var div;
  var elem, val;
  if(existingEl) {
    for(var prop in objectData){
      console.log('prop');
      console.log(prop);
      if(val=existingEl.getAttribute(prop)){ // prop stored as attribute
        if(val!==objectData[prop]) existingEl.setAttribute(prop, objectData[prop]);
      } else if(elem=existingEl.querySelector('[name='+prop+']')){ // prop stored in elem
        console.log('elem');
        console.log(elem);
        elem.textContent = objectData[prop]
      };
    }
    //existingEl.innerHTML = html;
    div = existingEl;
  } else {
    let pEl = document.createElement('div');
    pEl.innerHTML = html;
    objectContainer.appendChild(div=pEl.firstChild);
  }
  return div;
};

var removeObject = function(objectId) {
  var existingEl = document.querySelector('[_id="' + objectId + '"]');
  existingEl.parentElement.removeChild(existingEl);
};
