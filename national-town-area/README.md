
**调用方法名：**
 - TownshipArea(Promise异步调用，内部代码已将执行结果以JSON格式写入文件，并返回)

**参数：**

 - 个数：1
 - 类型：String or Number
 - 值：区/县code码值(6位或12位)

  **返回值：**

 - 该县/区下的所有乡镇(json格式)

**结果：** 根据传入的区/县code码值获取到的对应的乡镇的区域code码值及乡/镇名称并写入json文件

**代码中使用方式:**
```javascript
// 文件头部require方式引入
const area = require('national-town-area');

// 代码中使用
area.TownshipArea()
        .then(res => {
          // 这里写拿到数据后的自己的一些操作代码
          // 因为内部是异步调用方式，这里用then来接受结果，
          // 结果为查找到的该县/区下的所有乡镇数据，数据格式为json格式
          console.log(res);
        })
        .catch(err => { 
          console.log(err);
        });
```