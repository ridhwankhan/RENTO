'use client';
import React, { useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import './styles.css';

const Leaderboard = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Chart) {
      const s1 = {
        label: 'ashawe',
        borderColor: 'blue',
        steppedLine: true,
        data: [{
          x: '2017-01-06 00:00:00',
          y: 0
        }, {
          x: '2017-01-06 00:07:00',
          y: 50
        }, {
          x: '2017-01-06 00:15:40',
          y: 30
        }, {
          x: '2017-01-06 00:18:10',
          y: 26
        }, {
          x: '2017-01-06 00:20:40',
          y: 35
        }, {
          x: '2017-01-06 00:30:20',
          y: 40
        }, {
          x: '2017-01-06 00:40:10',
          y: 55
        }]
      };

      const s3 = {
        label: 'anonymous',
        borderColor: 'green',
        steppedLine: true,
        data: [{
          x: '2017-01-06 00:00:00',
          y: 0
        }, {
          x: '2017-01-06 00:10:00',
          y: 120
        }, {
          x: '2017-01-06 00:15:00',
          y: 400
        }, {
          x: '2017-01-06 00:21:00',
          y: 360
        }, {
          x: '2017-01-06 00:25:00',
          y: 390
        }, {
          x: '2017-01-06 00:40:00',
          y: 650
        }]
      };

      const s2 = {
        label: 'CR007',
        borderColor: 'red',
        steppedLine: true,
        data: [{
          x: '2017-01-06 00:00:00',
          y: 0
        }, {
          x: '2017-01-06 00:05:00',
          y: 150
        }, {
          x: '2017-01-06 00:15:00',
          y: 350
        }, {
          x: '2017-01-06 00:21:00',
          y: 500
        }, {
          x: '2017-01-06 00:25:00',
          y: 800
        }, {
          x: '2017-01-06 00:40:00',
          y: 900
        }, {
          x: '2017-01-06 00:44:59',
          y: 1900
        }]
      };

      const s4 = {
        label: 'liveoverflow',
        borderColor: 'pink',
        steppedLine: true,
        data: [{
          x: '2017-01-06 00:00:00',
          y: 0
        }, {
          x: '2017-01-06 00:03:00',
          y: 100
        }, {
          x: '2017-01-06 00:07:34',
          y: 250
        }, {
          x: '2017-01-06 00:10:45',
          y: 500
        }, {
          x: '2017-01-06 00:13:29',
          y: 650
        }, {
          x: '2017-01-06 00:21:00',
          y: 900
        }, {
          x: '2017-01-06 00:33:59',
          y: 1350
        }, {
          x: '2017-01-06 00:39:00',
          y: 1680
        }, {
          x: '2017-01-06 00:42:59',
          y: 2540
        }]
      };

      const ctx = document.getElementById('myChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [s1, s2, s3, s4]
        },
        options: {
          scales: {
            yAxes: [{
              type: 'linear'
            }],
            xAxes: [{
              type: 'time',
              distribution: 'series',
              time: {
                unit: 'minute',
                displayFormats: {
                  minute: 'mm:ss'
                },
                tooltipFormat: 'mm:ss'
              }
            }]
          }
        }
      });
    }
  }, []);

  return (
    <div className="imgloaded">
      <div className="glitch">
        <div className="glitch__img glitch__img_leaderboard"></div>
        <div className="glitch__img glitch__img_leaderboard"></div>
        <div className="glitch__img glitch__img_leaderboard"></div>
        <div className="glitch__img glitch__img_leaderboard"></div>
        <div className="glitch__img glitch__img_leaderboard"></div>
      </div>

      <div className="navbar-dark text-white">
        <div className="container">
          <nav className="navbar px-0 navbar-expand-lg navbar-dark">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <Link href="/" className="pl-md-0 p-3 text-decoration-none text-light">
                  <h3 className="bold"><span className="color_danger">RENTO</span><span className="color_white">CTF</span></h3>
                </Link>
              </div>
              <div className="navbar-nav ml-auto">
                <Link href="/" className="p-3 text-decoration-none text-light bold">Home</Link>
                <Link href="/about" className="p-3 text-decoration-none text-light bold">About</Link>
                <Link href="/hackerboard" className="p-3 text-decoration-none text-white bold">Leaderboard</Link>

              </div>
            </div>
          </nav>
        </div>
      </div>

      <div className="jumbotron bg-transparent mb-0 pt-3 radius-0">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <h1 className="display-1 bold color_white content__title text-center">
                <span className="color_danger">LEADER</span>BOARD<span className="vim-caret">&nbsp;</span>
              </h1>
              <p className="text-grey lead text-spacey text-center hackerFont">
                Where the owners gets ranked!
              </p>
              <div className="row justify-content-center my-5">
                <div className="col-xl-10">
                  <canvas id="myChart"></canvas>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5 justify-content-center">
            <div className="col-xl-10">
              <table className="table table-hover table-striped">
                <thead className="thead-dark hackerFont">
                  <tr>
                    <th>#</th>
                    <th>Team Name</th>
                    <th># Challenges Solved</th>
                    <th>Total Time Taken</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>Salam</td>
                    <td>10</td>
                    <td>1d</td>
                    <td>2540</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>kalam</td>
                    <td>8</td>
                    <td>2d</td>
                    <td>1900</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>anwar</td>
                    <td>7</td>
                    <td>2d3hr</td>
                    <td>1500</td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" strategy="beforeInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" strategy="beforeInteractive" />
      <Script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" strategy="beforeInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js" strategy="beforeInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js" strategy="beforeInteractive" />
    </div>
  );
};

export default Leaderboard;
