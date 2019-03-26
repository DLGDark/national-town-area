// 导入对象深拷贝方法函数
const copy = require('./deepClone');
// 加载cheerio库，用来在服务端直接操作页面dom
const cheerio = require('cheerio');
// 引入http模块
const http = require('http');
//引入编码格式处理模块
const iconv = require('iconv-lite');
// 引入文件系统模块
const fs=require('fs');

// url默认前缀
var staticUrl = "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/";
// 获取当前年份值
var year = new Date().getFullYear() -1;
//存储结果值
var onlyObj = {};


function TownshipArea(countyCode) {

	if(countyCode === '' || countyCode === undefined) return ;

    if(typeof countyCode !== "number" && typeof countyCode !== "string" ){
        try {
            throw new TypeError('Incoming parameter type error', "index.js");
        } catch (e) {
            console.log(e.name+':'+e.message+' in '+e.fileName);
            console.log(e.stack);
        }
    }

    let _countyCode = typeof countyCode === "number" ? String(countyCode) : countyCode ;

    let provinceCode = _countyCode.substr(0, 2);
    let cityCode = _countyCode.substr(2, 2);

    // 拼接出最终正确的url
    let url = staticUrl + year + '/' + provinceCode + '/' + cityCode + '/' + _countyCode.substr(0, 6) + '.html';

    // 发起请求
    http.get(url, (res) => {
        let chunkBuffers = [];

        res.on('data', (chunk) => {
            chunkBuffers.push(chunk);
        });

        res.on('end', () => {
            try {
                // 对字节进行处理
                let buffer = Buffer.concat(chunkBuffers);
                // 对window环境下的返回字符编码为gb2312编码格式的字符内容进行处理
                let html = iconv.decode(buffer, 'gb2312');

                let $townCheerio = cheerio.load(html);

                let $town = $townCheerio('.towntr');
                let townObj = [];

                let $td = '';

                $town.each(function (i, item) {
                    $td = $townCheerio(item).find('td');
                    let code = '';
                    let name = '';

                    $td.each(function (i, item) {
                        if ($townCheerio(item).find('a').length > 0) {
                            if (i === 0) {
                                code = $townCheerio(item).find('a').text();
                            } else {
                                name = $townCheerio(item).find('a').text();
                            }
                        } else {
                            if (i === 0) {
                                code = $townCheerio(item).text();
                            } else {
                                name = $townCheerio(item).text();
                            }
                        }
                    });

                    townObj.push({
                        townCode: code,
                        townName: name
                    });
                });

                onlyObj["countyCode"] = _countyCode;
                onlyObj.town = copy.deepClone(townObj);

                // 将数据写入文件
                fs.writeFile(year+'乡镇地区数据.json', JSON.stringify(onlyObj), (err) => {
                    if (err) throw err;
                    console.log('Township area data was successfully written');
                });

            } catch (e) {
                console.error(e.message);
            }

        }).on('error', (e) => {
            console.error(`出现错误: ${e.message}`);
        });
    });
}

module.exports = {TownshipArea}