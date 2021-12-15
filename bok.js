// //불변함이란 마구잡이로 원본 데이터가 수정되는 것을 방지해줌..복사해서 수정해야됨... 근데 막 다 복사하면 메모리 낭비가 되니 변경되는 거만 잘 해줘야함 ^.^
// // 함수도 래퍼런스 타입이기 때문에 변수에 함수를 담으면 함수의 모든걸 복사함...그래서 prototype이 메모리낭비가 적은것??

// var pri = 1
// var pri2 = 1 // 이 두개는 메모리 주소값이 같아서 값이 변하기전엔 계속 한개만 찾아서 씀  

// var obj1 = {name: 'jong'}
// var obj2 = {name: 'jong'} // 이 두개는 주소가 달라서 값이 같아도 래퍼런스는 무조건 메모리를 하나씩 차지 

// var obj3 = {name: 'jong'}
// var obj4 = obj3 // 복사돼서 같이 바뀜 
// ob4.name = 'hwan' //으로 바꾸면 당연히 obj3도 바뀜. 같은 주소 값을 참조하기때문

// //때문에 불변 복사를 함 ...은 한뎁스만 
// var obj4 = Object.assign({}, obj3) // 이렇게 복사를 하게 되면 두개가 전혀 다른 것이 됨 
// obj4.name = 'hwan' //으로 변경해도 obj3에는 영향이 가지않음 


// //그렇다면 배열도 같을까 ? 불변 복사를 했지만
// var obj5 = {name: 'jong', arr: [1,2]}
// var obj6 = Object.assign({}, obj5)
// obj6.arr.push(3) //을 하게되면 obj5도 arr: [1,2,3] 으로 기존값을 바꾸게됨. 이건 배열에 들어가있는 애들이 다른 주소값을 또 가지고 있음
// obj6.arr = [1,2,3] //근데 이건 당연히 덮는 거라 가능 
// // 그래서 어떻게 하냐 
// obj6.arr = obj.arr.concat(6) //이렇게 원본을 변경하는 .push가 아닌 .concat을 사용.. 이러면 obj5.arr는 변하지않음. 불변! 





// //함수 불변
// function fn(person) {
//     person.name = 'lee'
// }

// var person1 = { name: 'jonghwan' }
// fn(person1) 
// console.log(person1) //이렇게 되면 var person1 원본 name이 변경되어버림.
 
// // 따라서 아래처럼 복사해서 넘겨줘야됨 
// var person1 = { name: 'jonghwan' }
// var person2 = Object.assign({}, person1)
// fn(person2) 

// console.log(person1, person2) //원본과 복사되어 변경된 2가 나옴 





// // 배열
// var score = [1,2,3]
// var a = score
// var b = score

// score.push(4) //하면 모두 변경됨.. 바껴야한다면 메모리낭비 없이 하나의 메모리만을 사용함 

// //하지만 어떠한 값만 변경되야 한다면 ? 복사하는 메서드 사용
// var c = score.concat(4)



// // 객체의 프로퍼티를 못바꾸게 하는것이 const ..
// // 객체의 값을 못바꾸게 하는 것이 Object.freeze()






class Obj {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }


    tolk() {
        console.log(`내 이름은 ${this.name}, `)
    }
}


class Sunbbang extends Obj {
    constructor(name, age, hoho) {
        super(name, age)
        this.hoho = hoho //hoho는 setter를 설정할때 value로 들어가면서 셋터함수 실행됨
    }

    // tolk() {
    //     console.log('말하기 1번')
    // }

    sunbbang() {
        console.log('주먹질 1번')
        console.log(this.hoho)
    }

    get hoho() { //get 을 설정하면 this.hoho는 변수가 아니라 겟함수를 호출하게됨
        return this._hoho
    }
    set hoho(value) { //set을 설정하는 순간 = hoho는 셋터함수를 호출하게됨
        // if(value < 0) {
        //     throw Error('nono!')
        // } 
        this._hoho = value < 0 ? 0 : value
        //this._hoho는 결국 get에서 this.hoho로 들어감
    }
}


const jh = new Obj('jonghwan', 30)
console.log(jh.tolk())

const ho = new Sunbbang('hoho', 30, -1)
console.log(ho.tolk())
console.log(ho.sunbbang())








