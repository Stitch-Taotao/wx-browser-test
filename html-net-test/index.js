

class RequestTask {
    static globalIndex = 0;
    constructor() {
        this.index = RequestTask.globalIndex++;
        this.reqComplete = false;
        this.success = false;
        this.beginDate = new Date();
        this.endDate = this.beginDate;
    }
    complete() {
        this.reqComplete = true;
        this.endDate = new Date();
    }
    successFunc() {
        this.success = true;
        this.complete();
    }
    fail() {
        this.success = false;
        this.complete();
    }
    /// 求时长
    getDuration() {
        return this.endDate.getTime() - this.beginDate.getTime();
    }
}



const Method = {
    GET: Symbol('GET'),
    POST: Symbol('POST')
}

async function request(url, method, body) {
    const response = await fetch(url, {
        method: method.description,
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    })
    if (response.ok) {

    } else {
        throw new Error("请求失败")
    }
}

function Begin() {
    let reqs = [];
    async function task1() {
        return (async () => {
            let task = new RequestTask();
            // console.log(`创建的task是:${task}`)
            reqs.push(task)
            updateUI(reqs)
            let url = "https://www.letpub.com.cn/api/keke/v1/Grant/GrantGetArticleDetails"
            let body = JSON.stringify({ "article_id": "192" })
            try {
                await request(url, body);
                task.successFunc();
            } catch (error) {
                task.fail();
            } finally {
                updateUI(reqs);
            }
        })()
    }
    setInterval(task1, 15000);
    task1();
    function updateUI(reqs) {
        let appElement = document.getElementById("app");
        console.log(appElement)
        for (index in reqs) {
            let task = reqs[index];
            // console.log(`获取到task是:${task}`)
            let eleId = `item-${task.index}`;
            let itemEle = document.getElementById(eleId)
            if (!itemEle) {
                let div = document.createElement("div");
                div.className = "card"
                div.innerHTML = `
                <div class="card-body"  id="${eleId}">
                        <text class="card-title">${task.index}</text>
                        <text class="card-text">loading...</text>
                </div>`;
                appElement.appendChild(div);
            }
            if (task.reqComplete) {
                itemEle.innerHTML = `
                        <text class="card-title">${task.index}</text>
                        <text class="card-text">${task.success ? "成功" : "失败"}</text>
                        <text class="card-text">耗时：${task.getDuration()}</text>
                    `;
            }
        }
    }
}

Begin();
