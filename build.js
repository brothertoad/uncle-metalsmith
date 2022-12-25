/*jslint es6 */

/*
 * Metalsmith build file
 * Build site with `node build`
 */

'use strict';

const inplace = require('@metalsmith/in-place');
const layouts = require('@metalsmith/layouts');
const metalsmith = require('metalsmith');
const sass = require('metalsmith-sass');
const assets = require('metalsmith-assets-improved');
const permalinks = require('@metalsmith/permalinks');
const dataLoader = require('metalsmith-data-loader');
const metadata = require('metalsmith-metadata-directory');
const modelsAnalyzer = require('./modelsAnalyzer.js');
const lastModified = require('./lastModified.js');

const templateConfig = {
    engineOptions: {
        filters: {
        }
    }
};

metalsmith(__dirname)
    .clean(true)
    .source('./src/')
    .destination('./firebase-hosting/')
    .use(sass({ outputDir: 'css/' }))
    .use(dataLoader({
      removeSource: true
    }))
    .use(assets({
      src: "public",
      dest: "."
    }))
    .use(metadata({ directory: 'data/*.yaml' }))
    .use(modelsAnalyzer())
    .use(lastModified())
    .use(inplace(templateConfig))
    .use(layouts(templateConfig))
    .use(permalinks({ relative: false }))
    .build(function (err) {
        if (err) {
            throw err;
        }
        // console.log('Build finished!');
    });
