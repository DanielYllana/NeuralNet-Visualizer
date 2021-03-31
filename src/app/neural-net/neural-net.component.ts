import { HttpClient } from '@angular/common/http';
import { HostListener, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { FlaskapiService } from '../flaskapi.service';
import { Layer, Model } from './layer.model';
import { io } from 'socket.io-client';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-neural-net',
  templateUrl: './neural-net.component.html',
  styleUrls: ['./neural-net.component.css', '../app.component.css'],
})
export class NeuralNetComponent implements OnInit, OnDestroy {
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.update();
  }

  @HostListener('document:DOMContentLoaded', ['$event'])
  onContentLoaded() {
    setTimeout(() => {
      this.update();
    }, 10);
  }

  constructor(
    private flaskApiService: FlaskapiService,
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  // INIT VARS AND STUFF  //
  model = new Model([
    new Layer(1, 'Dense', 8, 'ReLU'),
    new Layer(2, 'Dense', 5, 'ReLU'),
  ]);

  positions: number[][][];
  public modelSubscription: Subscription;

  isAuth: boolean = false;
  user: any;
  username: string = 'Guest';
  training: boolean = false;
  private userSub: Subscription;

  public server: string = 'http://localhost:5000';

  // BUILT IN-METHODS //

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuth = !!user;
      this.user = user;
    });

    if (this.isAuth) {
      this.getModel();
    }

    this.connect();
    this.setRecieveMethod();
    this.getDataset();
    this.createChart();
  }

  ngOnDestroy() {
    this.modelSubscription.unsubscribe();
  }

  stopStartTraining(stopTraining: boolean) {
    if (stopTraining) {
      this.training = false;
    } else {
      this.training = !this.training;
    }
    this.startStopTraining(this.training);
  }

  // CUSTOM MEHTODS FOR SOCKET //
  private socketio: any;
  public X_test: any;
  public Y_test: any;
  chart: Chart;
  epoch: number = 0;

  connect() {
    this.socketio = io(this.server);
  }

  setRecieveMethod() {
    this.socketio.on('outputImage', (data) => {
      if (data['epoch'] != undefined) {
        this.epoch = data['epoch'];
      }

      if (data['coordinates'] != undefined) {
        //this.training = false;

        if (data['predictions'] != undefined) {
          var labels = JSON.parse(data['predictions']);
        } else {
          var labels = JSON.parse(data['Y_test']);
        }

        var cords = JSON.parse(data['coordinates']);

        this.X_test = [];
        var obj = null;
        for (var i = 0; i < cords.length; i++) {
          if (labels[i] == 1) {
            labels[i] = '#90cd8a';
          } else {
            labels[i] = '#f58368';
          }
          obj = {};

          obj['x'] = cords[i][0];
          obj['y'] = cords[i][1];

          this.X_test.push(obj);
        }

        this.Y_test = labels;
        this.updateChart();
      }
    });
  }

  public startStopTraining(training: boolean) {
    var full_msg = {
      training: training,
      sessionId: this.flaskApiService.getUsername(),
    };
    this.socketio.emit('new-message', full_msg);
  }

  public getDataset() {
    var full_msg = {
      sessionId: this.flaskApiService.getUsername(),
    };
    this.socketio.emit('get-dataset', full_msg);
  }

  public updateChart() {
    this.chart.data.datasets[0].data = this.X_test;
    this.chart.data.datasets[0].pointBackgroundColor = this.Y_test;

    this.chart.update();
  }

  public createChart() {
    this.chart = new Chart('canvas', {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: '',
            data: this.X_test,
            pointBackgroundColor: this.Y_test,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        scales: {
          yAxes: [
            {
              position: 'right',
            },
          ],
        },
        animation: {
          duration: 100,
          easing: 'linear',
        },
      },
    });

    this.chart.options.animation.duration = 0;
    this.chart.update();
  }

  // CUSTOM METHODS FOR MANAGEMENT  //

  resetDB() {
    this.model = new Model([new Layer(1, 'Dense', 8, 'ReLU')]);

    setTimeout(() => {
      for (var i = 0; i < this.model.layers.length; i++) {
        this.flaskApiService.manageModel(this.model);
      }
      this.update();
    }, 10);
  }

  async getModel() {
    this.modelSubscription = this.flaskApiService
      .getModel(this.model)
      .subscribe((p) => {
        this.model.jsonToModel(p['data']);

        setTimeout(() => {
          this.update();
        }, 10);
      });
  }

  modelUpdated() {
    this.stopStartTraining(true);
    this.onContentLoaded();
  }

  update() {
    this.clearShapes('paths');
    this.updatecoordsNeuron();
  }

  generateArrayOfNumbers(numbers: number) {
    return [...Array(numbers + 1).keys()].slice(1);
  }

  updatecoordsNeuron() {
    var i = 0;
    var j = 0;
    var k = 0;
    var x = 0;
    var y = 0;

    this.positions = [];

    var widthInput = document.getElementById('space-input');
    var widthHidden = document.getElementById('space-hidden');
    var widthOutput = document.getElementById('space-output');

    this.positions[0] = [];
    for (i = 0; i < this.model.features; i++) {
      x = 0;
      y = 0;

      this.positions[0][i] = [];

      var topNeuron = document.getElementById('layer-' + 0 + '-neuron-' + 1);
      var coordsNeuron = document.getElementById(
        'layer-' + 0 + '-neuron-' + (i + 1)
      );

      x = widthInput.offsetLeft + coordsNeuron.offsetLeft - 20;
      y = topNeuron.offsetTop + 45 * i + 15;

      this.positions[0][i][0] = x;
      this.positions[0][i][1] = y;
      this.positions[0][i][2] = x + 30;
    }

    for (i = 0; i < this.model.layers.length; i++) {
      this.positions[i + 1] = [];

      for (j = 0; j < this.model.layers[i].neurons; j++) {
        var x = 0;
        var y = 0;

        var coordsNeuron = document.getElementById(
          'layer-' + (i + 1) + '-neuron-' + (j + 1)
        );

        var topNeuron = document.getElementById(
          'layer-' + (i + 1) + '-neuron-' + 1
        );

        if (j + 1 <= this.model.maxDisplayNeurons) {
          this.positions[i + 1][j] = [];
          x = widthHidden.offsetLeft + coordsNeuron.offsetLeft - 20;
          y = topNeuron.offsetTop + 45 * j + 15;

          this.positions[i + 1][j][0] = x;
          this.positions[i + 1][j][1] = y;
          this.positions[i + 1][j][2] = x + 30;
          //this.addCircle(x.toString(), y.toString());
          //this.addCircle((x + 30).toString(), y.toString());
        }
      }
    }

    var outputIndex = this.positions.length;
    this.positions[outputIndex] = [];
    for (i = 0; i < this.model.classes; i++) {
      x = 0;
      y = 0;

      this.positions[outputIndex][i] = [];

      var topNeuron = document.getElementById('layer-' + 100 + '-neuron-' + 1);
      var coordsNeuron = document.getElementById(
        'layer-' + 100 + '-neuron-' + (i + 1)
      );

      x = widthOutput.offsetLeft + coordsNeuron.offsetLeft - 20;
      y = topNeuron.offsetTop + 45 * i + 15;

      this.positions[outputIndex][i][0] = x;
      this.positions[outputIndex][i][1] = y;
      this.positions[outputIndex][i][2] = x + 30;
    }

    for (i = 0; i < this.positions.length - 1; i++) {
      for (j = 0; j < this.positions[i].length; j++) {
        for (k = 0; k < this.positions[i + 1].length; k++) {
          this.addPath(
            this.positions[i][j][2],
            this.positions[i][j][1],
            this.positions[i + 1][k][0],
            this.positions[i + 1][k][1]
            //this.model.layers[i].enabled[j]
          );
        }
      }
    }
  }

  addCircle(x: string, y: string) {
    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    circle.setAttribute('class', 'circles');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '5');
    circle.setAttribute('stroke', 'blue');
    circle.setAttribute('stroke-width', '1');
    circle.setAttribute('fill', '#FFFFFF');

    document.getElementById('svg-input').appendChild(circle);
  }

  addPath(x: number, y: number, x2: number, y2: number, enabled?: boolean) {
    var deltaX = x2 - x;
    var deltaY = y2 - y;
    var string =
      'M ' +
      x.toString() +
      ' ' +
      y.toString() +
      ' l ' +
      deltaX.toString() +
      ' ' +
      deltaY.toString();

    var color = 'rgba(224, 166, 40, 1)';
    /*if (!enabled) {
      var color = 'rgba(224, 166, 41, 0.28)';
    }*/
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'paths');
    path.setAttribute('d', string);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '1');

    document.getElementById('svg-input').appendChild(path);
  }

  clearShapes(string: string) {
    var paras = document.getElementsByClassName(string);

    while (paras[0]) {
      paras[0].parentNode.removeChild(paras[0]);
    }
  }

  changeLearningRate(e: any) {
    this.model.learning_rate = Number(e.target.value);
    this.flaskApiService.manageModel(this.model);
  }

  changeBatchSize(e: any) {
    this.model.batch_size = Number(e.target.value);
    this.flaskApiService.manageModel(this.model);
  }
}
