export class Layer {
  public layerNumber: number;
  public type: string;
  public neurons: number;
  public activation: string;
  public enabled: boolean[] = [];
  public dropout: number;

  constructor(
    layerNumber: number,
    type: string,
    neurons: number,
    activation: string,
    dropout: number = 0
  ) {
    this.layerNumber = layerNumber;
    this.type = type;
    this.neurons = neurons;
    this.activation = activation;
    this.dropout = dropout;
    //this.enabled = new Array(this.neurons).fill(enabled);
  }
}

export class Model {
  public layers: Layer[];
  public maxDisplayNeurons: number = 10;
  public features: number = 2;
  public batch_size: number = 32;
  public classes: number = 2;
  public learning_rate: number = 0.001;
  public learning_rates: number[] = [
    10,
    3,
    1,
    0.3,
    0.1,
    0.03,
    0.01,
    0.003,
    0.001,
    0.0001,
    0.00001,
  ];
  public batch_sizes: number[] = [1, 16, 32, 64, 128, 256, 512];

  constructor(layers: Layer[]) {
    this.layers = layers;
  }

  changeLayer(layer: number, e: any) {
    this.layers[layer].type = e.target.value;
    /*console.log('Changed layer type to ' + this.type);*/
  }

  changeActivation(layer: number, e: any) {
    this.layers[layer].activation = e.target.value;

    /*console.log('Changed activation to ' + this.activation);*/
  }

  changeNeurons(layer: number, e: any) {
    var value = Number(e.target.value);
    if (value <= 1) {
      this.layers[layer].neurons = 1;
    } else {
      this.layers[layer].neurons = value;
    }
    /*console.log('Changed neurons to ' + this.neurons);*/
  }

  changeDropout(layer: number, e: any) {
    var value = Number(e.target.value);

    if (value <= 1 && value >= 0) {
      this.layers[layer].dropout = value;
    }

    /*console.log('Changed activation to ' + this.activation);*/
  }

  jsonToModel(json: any) {
    this.maxDisplayNeurons = json['maxDisplayNeurons'];
    this.features = json['features'];
    this.batch_size = json['batch_size'];
    this.classes = json['classes'];
    this.learning_rate = json['learning_rate'];
    const layers = json['layers'];

    var index = 0;

    this.layers = [];
    for (var index = 0; index < layers.length; index++) {
      var layer = layers[index];
      var newLayer = new Layer(
        layer['layerNumber'],
        layer['type'],
        layer['neurons'],
        layer['activation'],
        layer['dropout']
      );

      if (this.layers[index] != null) {
        this.layers[index] = newLayer;
      } else {
        this.layers.push(newLayer);
      }
    }
  }
}
