let cart = [] // 장바구니에 들어갈 상품들
      
      $.get('https://euneu.github.io/shopping/store.json').done(function(data){
        let products = data.products

        //-----상품 불러오기-----//
        products.forEach(function(a) {
          $('.produts-item').append(`
            <div class="col-sm-3">
                    <div class="item rounded p-2 bg-light" draggable="true" data-id="${a.id}">
                        <img src="/img/${a.photo}" draggable="false" class="w-100">
                        <h5 class="card-title">${a.title}</h5>
                        <p class="card-text"><small class="text-muted">${a.brand}</small></p>
                        <p class="card-text">가격 : ${a.price}</p>
                        <button class="btn btn-dark add" data-id="${a.id}">담기</button>
                    </div>
                  </div>
            `);
        });


        //------상품검색--------//
        $('#form').on("input", function(e){
          var input = $('#search').val();

          console.log(input)
          
          var search_arr = products.filter(function(item){
            return item.title.includes(input)
          })
          $('.row').html('');
          search_arr.forEach(function(a) {
          $('.produts-item').append(`
            <div class="col-sm-3">
                    <div class="item rounded p-2 bg-light" draggable="true" data-id="${a.id}">
                        <img src="/img/${a.photo}" draggable="false" class="w-100">
                        <h5 class="card-title">${a.title}</h5>
                        <p class="card-text"><small class="text-muted">${a.brand}</small></p>
                        <p class="card-text">가격 : ${a.price}</p>
                        <button class="btn btn-dark add" data-id="${a.id}">담기</button>
                    </div>
                  </div>
            `);
        });
        })


        //-----담기 버튼-----//
        
        $('.add').click(function(e){
          //장바구니에 상품 추가
          //대신 장바구니에 상품이 있다면 숫자만 추가

          //이벤트가 발생한 대상의 데이터 값
          //지금 누른 상품 번호
          let item_id = e.target.dataset.id;
          
          //장바구니 창에 상품이 존재하는가?
          //findIndex - > 첫 번째 요소의 인덱스 값을 반환 없다면 -1 반환
          var cart_item_id = cart.findIndex(function(a){
            return item_id == a.id
          })

          //cart_item == -1 라면 장바구니에 상품이 존재하지 않았다는 의미
          //cart에 추가해줌
          //find() -> 첫 번째 요소 값을 반환
          if(cart_item_id == -1){
            //첫 번째 요소 값 반환하기 위함(products의 상품 정보 가져오려고)
            let present_item =products.find(function(a){
              return a.id == item_id
            })
            //cart에 추가해줌
            //count는 장바구니에 추가한 갯수임
            present_item.count = 1;
            cart.push(present_item)
          }
          else{
            cart[cart_item_id].count++;
           }

          
          $('.drag').html('');
          cart.forEach(function(a) {
            $('.drag').append(
              `<div class="col-sm-3">
                      <div class="rounded p-2 bg-light" draggable="true">
                          <img src="/img/${a.photo}" class="w-100">
                          <h5 class="card-title">${a.title}</h5>
                          <p class="card-text"><small class="text-muted">${a.brand}</small></p>
                          <p class="card-text text-dark ">가격 : </p>
                          <p class="text-dark">${a.price}</p>
                          <input type="number" value="${a.count}" class="item-count w-100">
                      </div>
                    </div>
              `);
          });

          calculation();

          //---input 값 조정해도 계산되도록---//
          $('.item-count').on('input',function(){
            calculation();
          })
        }); //담기 끗!

        console.log(cart)
        
        //----드래그엔드롭-----//
          $('.item').on('dragstart', function(e){
            e.originalEvent.dataTransfer.setData('id',e.target.dataset.id)
          });
          $('.drag').on('dragover', function(e){
            e.preventDefault();
          });

          $('.drag').on('drop', function(e){

            let drag_item = e.originalEvent.dataTransfer.getData('id');
            $('.add').eq(drag_item).click();
            console.log(drag_item);

          });

      }); //get 끝


      //---최종가격---//

      //장바구니 input 안의 개수가 달라질 때마다 가격을 바꾸면 됨

      function calculation() {
        let final_price = 0;
        

        for(var i = 0; i< $('.item-count').length; i++){
          var count = $('.item-count').eq(i).val();
          var price = $('.item-count').eq(i).siblings('p').eq(2).text();
          
          final_price += parseFloat(count*price);

        }
        console.log(final_price)
        $('.final_price').html(`가격 : ${final_price}`);
      }

      //----구매하기, 영수증 클릭하면 열고 닫기----///
      $('.buy').on('click',function(){
        $('.modal1').addClass('show-modal');
      });
      $('#close').on('click',function(){
        $('.modal1').removeClass('show-modal');
      });

      
      //---성함, 연락처 저장---//

      let user_name = '';
      let user_phone = '';

      $('#user_name').on('input',function(){
        user_name = $('#user_name').val();
      })
      $('#user_name').on('input',function(){
        user_phone  = $('#user_phone').val();
      })

      $('#receipt').on('click',function(){
        $('.modal2').addClass('show-modal');
        var canvas = document.getElementById('canvas'); 
        var c = canvas.getContext('2d');
        c.font = '20px dotum';
        c.fillText(`성함 : ${user_name}`,20,30);
        c.fillText(`연락처 : ${user_phone}`,20,40);
        let sum = 0;
        cart.forEach(function(a,i){
          sum += parseInt(a.count)
          var count = (i+1);
          c.fillText(a.title,20, count * 100);
          c.fillText(a.brand,20, (count * 100) + (count *20));
          c.fillText(`가격 : ${a.price}`,20,(count * 100) + (count *40));
          c.fillText(`수량 : ${a.count}`,20,(count * 100) + (count *60));

        });

        
        c.fillText(`합계 : ${sum}`,20,780);
        c.fillText(`총  ${$('.final_price').html()}`,20,800);
        


      })     
      $('#receipt_close').on('click',function(){
        $('.modal1').removeClass('show-modal');
        $('.modal2').removeClass('show-modal');
      });

      console.log(cart)
