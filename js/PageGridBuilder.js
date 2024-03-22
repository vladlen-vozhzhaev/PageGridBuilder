class PageGridBuilder {
    _containers = [];
    static target = location.host;
    static page = document.createElement('div');
    static addBlockBtn = document.createElement('button');
    static columnPreview = document.createElement('div');
    static columnCount;
    static singleton;

    static init(div){
        fetch('https://vozhzhaev.ru/product/pageGridConstructor?target='+this.target);
        this.page.classList.add('container', 'border', 'w-100', 'my-3');
        this.addBlockBtn.classList.add('btn', 'btn-success', 'p-1');
        this.addBlockBtn.style.position = "fixed";
        this.addBlockBtn.style.bottom = "100px";
        this.addBlockBtn.style.right = "50px";
        this.addBlockBtn.dataset.bsToggle = "modal";
        this.addBlockBtn.dataset.bsTarget = "#elementsModal";
        this.addBlockBtn.innerHTML = `<img style="filter: invert(100);" src="icons/plus-large-svgrepo-com.svg" width="30px" alt=""> Добавить блок`;
        div.append(this.page);
        document.body.append(this.addBlockBtn);
        PageGridBuilder.createElementsModal();
        PageGridBuilder.createColumnModal();
        this.singleton = new PageGridBuilder();
        return this.singleton;
    }

    addContainer = (container)=>{
        let count = this._containers.push(container);
        this._containers[count-1].id = "container_"+(count-1);
        this._containers[count-1].dataset.builder = "true"
        return count-1;
    }
    addContainerContent = (containerIndex, content)=>{
        this._containers[containerIndex].append(content);
    }
    renderDOM = (page)=>{
        this._containers.forEach(container=>{
            container.style.border = "2px dotted #03a5fc";
            if(container.firstElementChild.classList.contains('row')){
                container.firstElementChild.childNodes.forEach((col)=>{
                    this.renderAddContentBtn(col);

                })
            }
            page.append(container);
        })
    }

    renderAddContentBtn = (col)=>{
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-light', 'my-3', 'btn-spec-elem-page-grid-builder');
        button.style.display = 'block';
        button.style.margin  = 'auto';
        button.innerHTML = `<img src="icons/content.png" alt=""><br>Добавить контент`;
        button.onclick = ()=>{
            this.renderSunEditor(col, true);
        }
        if(!col.hasChildNodes(button)){
            col.append(button);
        }
    }

    renderSunEditor = (col, start)=>{
        let oldContent = "";
        if(!start){
            oldContent = col.innerHTML;
        }
        col.innerHTML = "";
        col.classList.remove('edit-element');
        const textarea = document.createElement('textarea');
        col.append(textarea);
        const editor = SUNEDITOR.create(textarea,{
            lang: SUNEDITOR_LANG['ru'],
            width: "100%",
            height: "350px",
            katex: katex,
            imageWidth: "100%",
            buttonList: [
                ['undo', 'redo'],
                ['font', 'fontSize', 'formatBlock'],
                ['paragraphStyle', 'blockquote'],
                ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                ['fontColor', 'hiliteColor', 'textStyle'],
                ['removeFormat'],
                '/', // Line break
                ['outdent', 'indent'],
                ['align', 'horizontalRule', 'list', 'lineHeight'],
                ['math','table', 'link', 'image', 'video', 'audio' /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
                /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
                ['fullScreen'],
                ['preview', 'print'],
                /** ['dir', 'dir_ltr', 'dir_rtl'] */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
            ]
        });
        editor.setContents(oldContent);
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-success', 'w-100');
        button.innerText = 'Применить';
        button.onclick = ()=>{
            col.classList.add('edit-element');
            col.innerHTML = editor.getContents();
            col.childNodes.forEach(elem=>{
                elem.onclick = ()=>{this.renderSunEditor(col, false)};
            })
        }
        col.append(button);
    }

    static renderContainer(contentType){
        this.columnPreview.innerHTML = "";
        if(contentType === 'grid'){
            const columnModal = new bootstrap.Modal('#columnModal');
            this.columnCountHandler('-')
            columnModal.show();
        }else{
            this.columnCountHandler('-');
            this.columnCountHandler('-');
            this.columnCountHandler('-');
            this.buildDOM();
        }
    }

    static columnCountHandler(op){
        let currentCountColumns = 0;
        if(this.columnPreview.firstChild){
            currentCountColumns = this.columnPreview.firstChild.childNodes.length;
        }
        let count = +this.columnCount.innerText+((op=="+")?1:-1);
        if(count<1) return;
        this.columnCount.innerText = count;
        this.renderColumnPreview(count, currentCountColumns, this.columnPreview.firstChild);
    }
    static renderColumnPreview(count, currentCountColumns, row){
        row = row || document.createElement('div');
        if(!row.classList.contains('row'))  row.classList.add('row');
        if(count>currentCountColumns){
            for (let i = 0; i < count-currentCountColumns; i++) {
                const col = document.createElement('div');
                const configBtn = document.createElement('button');
                configBtn.classList.add('my-4', 'btn', 'btn-light');
                configBtn.innerHTML = `<img src="icons/config.png" alt=""><br><span>настроить</span>`;
                configBtn.onclick = ()=>{
                    const p = document.createElement('p');
                    p.innerText = "Ширина (секций): ";
                    const select = document.createElement('select');
                    const option = document.createElement('option');
                    option.value = 0;
                    option.innerText = 'auto';
                    select.append(option);
                    for (let j = 1; j <= 12; j++) {
                        const option = document.createElement('option');
                        option.value = j;
                        option.innerText = j+" секций";
                        select.append(option);
                    }
                    select.onchange = ()=>{
                        col.classList.forEach(item=>{
                            if(item === 'text-center') return;
                            col.classList.remove(item);
                        });
                        col.classList.add('col-sm-'+select.value);
                    }
                    p.append(select);
                    col.append(p);
                }
                col.classList.add('col-sm', 'text-center');
                col.style.border = "1px dotted rgba(52, 168, 235, .5)";
                col.append(configBtn);
                row.append(col);
            }
        }else{
            row.lastChild.remove();
        }

        this.columnPreview.append(row);
    }

    static buildDOM(){
        const container = document.createElement('div');
        container.classList.add('container');
        const containerIndex = PageGridBuilder.singleton.addContainer(container);
        const cols = [];
        Object.assign(cols, this.columnPreview.firstElementChild.childNodes);
        const row = this.columnPreview.firstElementChild;
        row.innerHTML = "";
        cols.forEach((col)=>{
            col.classList.remove('text-center');
            col.innerHTML = "";
            row.append(col);
        })
        PageGridBuilder.singleton.addContainerContent(containerIndex, row);
        PageGridBuilder.singleton.renderDOM(this.page);
        this.columnPreview.innerHTML = "";
        this.columnCount.innerText = "4";
    }

    static createElementsModal(){
        const modal = this.createModal("elementsModal", "Содержимое блока");
        const bodyRow = document.createElement('div');
        const bodyRowCol1 = document.createElement('div');
        const bodyRowCol2 = document.createElement('div');
        const renderGridBtn = document.createElement('div');
        const renderContent = document.createElement('div');
        bodyRow.classList.add('row');
        bodyRowCol1.classList.add('col-sm-12', 'my-3');
        bodyRowCol2.classList.add('col-sm-12');
        renderGridBtn.classList.add('btn', 'btn-lg', 'btn-light', 'me-3', 'w-100', 'text-start');
        renderGridBtn.dataset.bsDismiss = "modal";
        renderContent.classList.add('btn', 'btn-lg', 'btn-light', 'me-3', 'w-100', 'text-start');
        renderContent.dataset.bsDismiss = "modal";
        renderGridBtn.onclick = ()=>{
            this.renderContainer('grid');
        }
        renderContent.onclick = ()=>{
            this.renderContainer('content');
        }
        renderGridBtn.innerHTML = `
            <div class="row">
                <div class="col-2"><img src="icons/grid.png" alt=""></div>
                <div class="col-10">
                    <span class="small">Использовать систему сеток в блоке для размещения контента</span>
                </div>
            </div>`;
        renderContent.innerHTML = `
            <div class="row">
                <div class="col-2"><img src="icons/content.png" alt=""></div>
                <div class="col-10">
                    <span class="small">Разместить контент без сетки</span>
                </div>
            </div>`;
        bodyRowCol1.append(renderGridBtn);
        bodyRowCol2.append(renderContent);
        bodyRow.append(bodyRowCol1, bodyRowCol2);
        modal.querySelector('.modal-body').append(bodyRow);
        document.body.append(modal);
    }

    static createColumnModal(){
        const modal = this.createModal('columnModal', 'Настройка сетки', 'modal-fullscreen');
        modal.querySelector('.modal-body').innerHTML = `
            <div class="alert alert-primary" role="alert">
                <p>Отлично! Теперь вам необходимо выбрать количество колонок в блоке.</p>
                <p>
                    Система сеток делит страницу на 12 секций. Вы можете задавать ширину колонок от 1 до 12, однако если колонки не помещаются в 12 секций, то они переносятся вниз.
                    Например вы задаёте 3 колонки с ширинами 4, 6 и 8 секций. В этом случае первые две колонки будут идти друг за другом, так как их ширина 4+6 умещается в 12 секций, а вот последняя с шириной 8 будет перенесена вниз.
                </p>
    
                <ol>
                    <li>Выберите количество колонок</li>
                    <li>Настройте ширину колонок, каждая колонка может занимать от 1 до 12 секций</li>
                    <li><!--Настройте параметры адаптации для различных типов устройств -->(по умолчанию колонки адаптируются для ПК и мобильных)</li>
                </ol>
            </div>
            <p>Количество колонок</p>
            <p>
                <button onclick="PageGridBuilder.columnCountHandler('-')" class="btn btn-light">-</button>
                <span id="columnCount">4</span>
                <button onclick="PageGridBuilder.columnCountHandler('+')" class="btn btn-light">+</button>
                <button class="btn btn-primary ms-5" onclick="PageGridBuilder.buildDOM()" data-bs-dismiss="modal">Применить</button>
            </p>
            <h4>Предпросмотр</h4>
        `;
        this.columnCount = modal.querySelector('#columnCount');
        this.columnPreview.id = 'columnPreview';
        modal.querySelector('.modal-body').append(this.columnPreview);
        document.body.append(modal);
    }

    static createModal(modalId, modalTitle, modalSize="modal-dialog-centered"){
        const modal = document.createElement('div');
        const modalDialog = document.createElement('div');
        const modalContent = document.createElement('div');
        const modalHeader = document.createElement('div');
        const modalBody = document.createElement('div');
        const modalFooter = document.createElement('div');
        const h1 = document.createElement('h1');
        const headerBtn = document.createElement('button');
        modal.id = modalId;
        modal.classList.add('modal', 'fade');
        modal.tabIndex = -1;
        modal.ariaHidden = "true";
        modalDialog.classList.add('modal-dialog', modalSize);
        modalContent.classList.add('modal-content');
        modalHeader.classList.add('modal-header');
        modalBody.classList.add('modal-body');
        modalFooter.classList.add('modal-footer');
        h1.classList.add('modal-title', 'fs-5');
        h1.innerText = modalTitle;
        headerBtn.type = "button";
        headerBtn.classList.add('btn-close');
        headerBtn.dataset.bsDismiss = "modal";
        headerBtn.ariaLabel = "Закрыть";
        modalHeader.append(h1, headerBtn);
        modalFooter.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отменить</button>`;
        modalContent.append(modalHeader, modalBody, modalFooter);
        modalDialog.append(modalContent);
        modal.append(modalDialog);
        return modal;
    }

    setHTML(htmlString){
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const documentBody = doc.body;
        this._containers = [];
        PageGridBuilder.page.innerHTML = "";
        documentBody.childNodes.forEach(container =>{
            if(container.dataset.builder){
                const row = container.firstChild;
                if(row.classList.contains('row')){
                    row.childNodes.forEach(col=>{
                        if(col.firstChild.dataset.content === "elem-page-grid-builder"){
                            col.innerHTML = "";
                            this.renderAddContentBtn(col);
                        }else{
                            col.classList.add("edit-element");
                            col.childNodes.forEach(elem=>{
                                elem.onclick = ()=>{this.renderSunEditor(col, false)};
                            })
                        }
                    });
                }
            }
            this._containers.push(container);
        });
        this._containers.forEach(container=>{
            PageGridBuilder.page.append(container);
        })
    }
    getHTML = ()=>{
        let result = "";
        this._containers.forEach((container)=>{
            container.style.border = "";
            if(container.firstElementChild.classList.contains('row')){
                Array.from(container.firstElementChild.children).forEach(col=>{
                    if(col.firstElementChild.classList.contains('btn-spec-elem-page-grid-builder')){
                        col.innerHTML = "<span data-content='elem-page-grid-builder'></span>";
                    }else{
                        col.classList.remove('edit-element');
                        col.style.border = "";
                    }
                })
            }
            result += container.outerHTML;
        });
        return result;
    }
}