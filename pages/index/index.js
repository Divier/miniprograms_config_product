Page({
  onLoad(query) {
    this.setData({
      vBasePrice: this.data.sizes[this.data.index].value,
      vDiscount: this.data.vSwitch ? 0 : 10
    });
    this.loadImage();
    this.calculate();
  },

  data: {
    sizes: [
      {
        name: 'XS',
        value: 10
      },
      {
        name: 'S',
        value: 20
      },
      {
        name: 'M',
        value: 30
      },
      {
        name: 'L',
        value: 40
      },
      {
        name: 'XL',
        value: 50
      }
    ],
    colors: [
      {
        name: 'Red',
        value: 10
      },
      {
        name: 'Blue',
        value: 20,
        checked: false
      },
      {
        name: 'Yellow',
        value: 30
      },
      {
        name: 'Green',
        value: 40
      },
    ],

    nodes: [
      {
        id: 0,
        children: [{
          text: 'BASE PRICE: ',
          value: 0
        }],
      },
      {
        id: 1,
        children: [{
          text: 'ADDITIONAL PRICE: ',
          value: 0
        }],
      },
      {
        id: 2,
        children: [{
          text: 'DISCOUNT: ',
          value: 0
        }],
      },
      {
        id: 3,
        children: [{
          text: 'TOTAL: ',
          value: 0
        }],
      },
    ],
    imageREST : 'data:image/png;base64, ',
    index: 0,
    vTotal: 0,
    vBasePrice: 0,
    vAdditionalPrice: 0,
    vDiscount: 10,
    vAmount: 1,
    vSwitch: true
  },

  pickerChange(e) {
    //console.log(e.detail.value);
    this.setData({
      index: e.detail.value
    });
    const { value } = this.data.sizes[this.data.index];
    this.setData({
      vBasePrice: value
    });
    this.calculate();
  },

  checkBoxChange(e) {
    //console.log(e.detail.value);
    let sum = 0;
    e.detail.value.forEach(value => {
      sum += value;
    });
    //console.log(sum);
    this.setData({
      vAdditionalPrice: sum,
    });
    this.calculate();
  },

  sliderChange(e) {
    //console.log(this.data.vAmount);
    this.setData({
      vAmount: e.detail.value,
      vSwitch: this.data.vAmount >= 5 ? false : true,
      vDiscount: this.data.vAmount >= 5 ? 10 : 0
    });
    this.calculate();
  },

  switchChange(e) {
    //console.log(e.detail.value);
    this.setData({
      vDiscount: e.detail.value ? 10 : 0
    });
    this.calculate();
  },

  calculate() {
    //console.log(e.detail.value);
    this.setData({
      vTotal: (this.data.vBasePrice + this.data.vAdditionalPrice)
    });

    if (this.data.vAmount > 1) {
      this.setData({
        vTotal: (this.data.vTotal * this.data.vAmount)
      });
    }

    if (this.data.vDiscount > 0) {
      this.setData({
        vTotal: this.data.vTotal - ((this.data.vTotal * this.data.vDiscount) / 100)
      });
    }
    this.showInfo();
  },

  showInfo() {
    //console.log([...this.data.nodes]);
    const nodes = this.data.nodes.map((node) => {
      const { id, children } = node;
      const childrens = children.map((ch) => {
        const { value } = ch;

        let exit;
        if (id === 0) {
          exit = value + this.data.vBasePrice;
        }
        if (id === 1) {
          exit = value + this.data.vAdditionalPrice;
        }
        if (id === 2) {
          exit = value + this.data.vDiscount;
        }
        if (id === 3) {
          exit = value + this.data.vTotal;
        }
        //console.log(text);
        return {
          ...ch,
          //text : text + (value + _val)
          value: exit
        }
      });
      //console.log(childrens);
      return {
        ...node,
        children: childrens
      }
    });

    //console.log(nodes);
    this.setData({
      nodes: nodes
    });
  },

  loadImage() {

    const task = my.request({
      url: 'https://httpbin.org/image',
      method: 'GET',
      dataType: 'base64',
      success: function(res) {
        //console.log(res);
        //my.alert({content: 'success'});
      },
      fail: function(res) {
        //my.alert({content: 'fail'});
      },
      complete: function(res) {
        my.hideLoading();
        //my.alert({content: 'complete'});
      }
    });
    task.then((value) => {
      //console.log(value.data);
      this.setData({
        imageREST: this.data.imageREST + value.data
      }) 
    }).catch((err) => {
      console.error(err);
      this.setData({
        imageREST: '../../images/descarga.png'
      }) 
    });
  }
});