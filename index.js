'use strict';
var cheerio = require('cheerio')
var fs = require('fs')
var path = require('path')
var injectExtraScript = fs.readFileSync(path.resolve(__dirname, './lib/lazy-load.js'), { encoding: 'utf-8' })

function lazyloadImg(source) {
  // add js
  if (/<\/body>/gi.test(source)) {
    let lastIndex = source.lastIndexOf('</body>')
    source = source.substring(0, lastIndex) + '<script>' + injectExtraScript + '</script>' + source.substring(lastIndex, source.length)
  }

  var $$ = cheerio.load(source, {
    decodeEntities: false
  });
  //遍历所有 img 标签，添加data-original属性
  $$('img').each(function (index, element) {
    var oldsrc = $$(element).attr('src')
    if (oldsrc) {
      $$(element).removeAttr('src')
      $$(element).addClass('lazy')
      $$(element).attr({
        'data-src': oldsrc
      })
    }
  });
  return $$.html()
}

hexo.extend.filter.register('after_render:html', lazyloadImg)
