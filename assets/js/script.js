$(document).ready(function() {
    $(".post-constructor").sortable({
        group: "name",
        draggable: '.wireframe_draggable',
        animation: 150,
        filter: '.wireframe_not-dragg',
        onMove: function (event) {
            return !event.related.classList.contains('wireframe_not-dragg');
        },
    });

    $('body').on("click", '[data-wireframe-up]', function() {
        let $parent = $(this).closest(".wireframe_draggable");
        $parent.prev('.wireframe_draggable').before($parent);
    });

    $('body').on("click", '[data-wireframe-down]', function() {
        let $parent = $(this).closest(".wireframe_draggable");
        $parent.next('.wireframe_draggable').after($parent);
    });

    $('[data-post-tab]').not('.disabled').on('click', function () {
        console.log('click');
        let $this = $(this),
            $attr = $this.attr('data-post-tab');
        $('[data-post-tab]').parent().removeClass('active');
        $this.parent().addClass('active');
        $('[data-post-cont]').removeClass('active');
        $('[data-post-cont="'+$attr+'"]').addClass('active');
    });

    $('#post_title').on('change', function () {
        let $this_val = $(this).val();
        if ($this_val === '') {
            $('#post_title_out').text('Add journal title').css('opacity', '0.5');
        } else {
            $('#post_title_out').text($this_val).css('opacity', '1');
        }
    });

    $('.post-constructor__initial-letter').on('click', function () {
        $(this).find('span').hide();
        $(this).find('textarea').show().focus();
        autosize.update($('.post-constructor__initial-letter textarea.post-constructor__textarea'));
    });
    $('.post-constructor__initial-letter textarea').on('focusout', function () {
        $(this).hide();
        $(this).parent().find('span').show();
    });
    $('.post-constructor__initial-letter textarea').on('change', function () {
        let $this_val = $(this).val();
        $(this).parent().find('span').text($this_val);
    });

    $('.jour-tags').tagsInput({
        'width':'100%',
        'defaultText': 'Add journal tags...'
    });
    $('.jour-peop-tags').tagsInput({
        'width':'100%',
        'defaultText': 'Tag someone...'
    });

    autosize($('.post-constructor textarea.post-constructor__textarea'));

    // top-menu for .wireframe
    $('body').on('click', '[data-drop-trig]', function () {
        let $this_drop = $(this).parent().find('[data-drop]'),
            $this_frame = $(this).closest('.wireframe');
        $('.wireframe').not($this_frame).removeClass('active');
        $this_frame.addClass('active');
        $('[data-drop]').not($this_drop).removeClass('active');
        $this_drop.toggleClass('active');
    });
    $('body').on('click', function (e) {
        if (!$('[data-drop-trig]').is(e.target)
            && $('[data-drop-trig]').has(e.target).length === 0) {
            $('.wireframe, [data-drop]').removeClass('active');
        }
    });

    // img-text row
    $('.post-constructor__img-text .post-constructor__textarea').on('DOMSubtreeModified', function () {
        var $this = $(this),
            $this_val = $this.html();

        if ($this_val === '') {
            $this.addClass('placeholder').addClass('emp');
        } else {
            $this.removeClass('placeholder').removeClass('emp');
        }
        $this.closest('.post-constructor__img-text').find('textarea').val($this_val);
    });
    $('.post-constructor__img-text .post-constructor__textarea').on('focus', function () {
        $(this).removeClass('placeholder');
    });
    $('.post-constructor__img-text .post-constructor__textarea').on('focusout', function () {
        let $this = $(this),
            $this_val = $this.text();

        if ($this_val === '') {
            $this.addClass('placeholder').text('');
        }
    });

    // uploading img-files to photo block
    function imagesPreview(input, button_block) {
        if (input.files && input.files[0]) {
            let filesAmount = input.files.length,
                $parent = button_block;

            $parent.addClass('updated');
            $parent.find('.btn-add-file__cont').addClass('hidden');
            $parent.find('.btn-add-file__preview').removeClass('hidden');

            $parent.find('.btn-add-file__preview img').remove();
            $parent.closest('.wireframe').find('.car-preview.slick-initialized').slick('unslick');
            $parent.closest('.wireframe').find('.car-preview > *').remove();

            if (filesAmount > 1) {
                // carusel
                for (let i = 0; i < filesAmount; i++) {
                    let reader = new FileReader();
                    reader.onload = function(event) {
                        $($.parseHTML('<div><img></div>')).find('img').attr('src', event.target.result).parent().appendTo($parent.closest('.wireframe').find('.car-preview'));
                    }
                    reader.readAsDataURL(input.files[i]);
                }
                setTimeout(function() {
                    $('.car-preview').slick({
                        slidesToShow: 3,
                        infinite: false,
                        draggable: false,
                    });
                }, 1000);
            } else {
                // single img
                let reader = new FileReader();
                reader.onload = function(event) {
                    $($.parseHTML('<img>')).attr('src', event.target.result).appendTo($parent.find('.btn-add-file__preview'));
                }
                reader.readAsDataURL(input.files[0]);
            }
        }
    }
    function change_img_text_height($block) {
        let height = $block.height();
        $block.parent().css('min-height', height);
        $block.parent().find('.post-constructor__textarea').css('min-height', height);
    }
    $('body').on('change', '.btn-add-file .btn-add-file__input[data-img-upload]', function(){
        let $photoBlock = $(this).closest('.btn-add-file');

        imagesPreview(this, $photoBlock);

        // resize blocks in img-text block
        if ( $photoBlock.parent().hasClass('post-constructor__img-text') ) {
            setTimeout(function() {
                change_img_text_height($photoBlock);
            }, 100);
        }
    });
    $('body').on('click', '[data-change-photo]', function(){
        $(this).closest('.wireframe').find('.btn-add-file').click();
    });


    // switch photo position in img-text row
    $('[data-switch-photo]').on('click', function () {
        $(this).closest('.wireframe ').find('.post-constructor__img-text').toggleClass('post-constructor__img-text_reverse');
    });

    // add/hide photo-caption for photoframe
    $('body').on('click', '[data-add-photo-caption]', function () {
        let $this = $(this),
            $frame = $(this).closest('.wireframe');

        $this.addClass('hidden');
        $this.parent().find('[data-rm-photo-caption]').removeClass('hidden');

        $frame.find('.post-constructor__textarea_author').slideDown(300);
        autosize.update($frame.find('.post-constructor__textarea_author'));
    });
    $('body').on('click', '[data-rm-photo-caption]', function () {
        let $this = $(this),
            $frame = $(this).closest('.wireframe');

        $this.addClass('hidden');
        $this.parent().find('[data-add-photo-caption]').removeClass('hidden');

        $frame.find('.post-constructor__textarea_author').slideUp(300);
    });

    // remove .wireframe
    $('body').on('click', '[data-del-sec]', function () {
        let $parent = $(this).closest('.wireframe');
        $parent.slideUp(400, function() { $(this).remove(); } );
        // $parent.prev().slideUp(400, function() { $(this).remove(); } );
    });

    // open/hide buttons in .add-block
    $('body').on('click', '[data-show-btns]', function () {
        $(this).slideUp(400);
        $(this).closest('.add-cont').find('.add-cont__box').slideDown(400);
        $(this).closest('.add-cont').addClass('opened');
    });
    $('body').on('click', '[data-hide-btns]', function () {
        $(this).closest('.add-cont').find('[data-show-btns]').slideDown(400);
        $(this).closest('.add-cont').find('.add-cont__box').slideUp(400, function() {
            $(this).closest('.add-cont').removeClass('opened');
        });
    });

    // quotes caption
    $('body').on('click', '[data-rm-cap]', function () {
        let $this = $(this),
            $frame = $(this).closest('.wireframe');

        $this.addClass('hidden');
        $this.parent().find('[data-add-cap]').removeClass('hidden');

        $frame.find('.post-constructor__textarea_author').slideUp(300);
    });
    $('body').on('click', '[data-add-cap]', function () {
        let $this = $(this),
            $frame = $(this).closest('.wireframe');

        $this.addClass('hidden');
        $this.parent().find('[data-rm-cap]').removeClass('hidden');

        $frame.find('.post-constructor__textarea_author').slideDown(300);
        autosize.update($frame.find('.post-constructor__textarea_author'));
    });

    // add frames
    $('body').on('click', '[data-add-wireframe]', function () {
        let $this = $(this),
            $parent = $(this).closest('.wireframe'),
            thisAttr = $this.attr('data-add-wireframe');

        let add_block = '<div class="add-cont">\n' +
            '                      <button class="btn show-btns btn-white" data-show-btns="data-show-btns">\n' +
            '                        <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">\n' +
            '                        <g>\n' +
            '                        <path d="M16.5,11.3h-3.8V7.5c0-0.4-0.3-0.8-0.8-0.8s-0.8,0.3-0.8,0.8v3.8H7.5c-0.4,0-0.8,0.3-0.8,0.8s0.3,0.8,0.8,0.8h3.8v3.8\n' +
            '                        c0,0.4,0.3,0.8,0.8,0.8s0.8-0.3,0.8-0.8v-3.8h3.8c0.4,0,0.8-0.3,0.8-0.8S16.9,11.3,16.5,11.3z"></path>\n' +
            '                        <path d="M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12c6.6,0,12-5.4,12-12S18.6,0,12,0z M12,22.5C6.2,22.5,1.5,17.8,1.5,12S6.2,1.5,12,1.5\n' +
            '                        c5.8,0,10.5,4.7,10.5,10.5S17.8,22.5,12,22.5z"></path>\n' +
            '                        </g>\n' +
            '                        </svg><span>Add content</span>\n' +
            '                      </button>\n' +
            '                      <div class="add-cont__box">\n' +
            '                        <div class="add-cont__btns">\n' +
            '                          <button class="btn btn-white" data-add-wireframe="text">\n' +
            '                            <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.1 19.4" style="enable-background:new 0 0 25.1 19.4;" xml:space="preserve">\n' +
            '                            <path d="M0,0.8L0,0.8C0,0.4,0.4,0,0.8,0h23.5c0.4,0,0.8,0.4,0.8,0.8v0c0,0.4-0.4,0.8-0.8,0.8H0.8C0.4,1.6,0,1.3,0,0.8z"></path>\n' +
            '                            <path d="M0,6.5L0,6.5C0,6,0.4,5.7,0.8,5.7h17.8c0.4,0,0.8,0.4,0.8,0.8v0c0,0.4-0.4,0.8-0.8,0.8H0.8C0.4,7.3,0,6.9,0,6.5z"></path>\n' +
            '                            <path d="M0,12.5L0,12.5c0-0.4,0.4-0.8,0.8-0.8h23.5c0.4,0,0.8,0.4,0.8,0.8v0c0,0.4-0.4,0.8-0.8,0.8H0.8C0.4,13.3,0,13,0,12.5z"></path>\n' +
            '                            <path d="M0,18.6L0,18.6c0-0.4,0.4-0.8,0.8-0.8h19.5c0.4,0,0.8,0.4,0.8,0.8v0c0,0.4-0.4,0.8-0.8,0.8H0.8C0.4,19.4,0,19,0,18.6z"></path>\n' +
            '                            </svg><span>Text</span>\n' +
            '                          </button>\n' +
            '                          <button class="btn btn-white" data-add-wireframe="photo">\n' +
            '                            <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 18.8" style="enable-background:new 0 0 24 18.8;" xml:space="preserve">\n' +
            '                            <style type="text/css">\n' +
            '                            .st0{fill:none;stroke:#000000;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}\n' +
            '                               </style>\n' +
            '                               <g id="Group_32_2_">\n' +
            '                               <g id="picture-landscape_2_">\n' +
            '                               <path d="M21.8,0H2.3C1,0,0,1,0,2.3v14.3c0,1.2,1,2.3,2.3,2.3h19.5c1.2,0,2.3-1,2.3-2.3V2.3C24,1,23,0,21.8,0z M22.5,16.5\n' +
            '                               c0,0.4-0.3,0.8-0.8,0.8H6.2l3.1-4.2c0.1-0.2,0.3-0.3,0.5-0.3c0.2,0,0.4,0.1,0.6,0.2l1,1c0.2,0.2,0.4,0.2,0.6,0.2\n' +
            '                            c0.2,0,0.4-0.1,0.5-0.3l3.3-4.4c0.3-0.4,0.9-0.4,1.2,0l2.7,3.6c0.2,0.3,0.7,0.4,1,0.1c0.3-0.2,0.4-0.7,0.1-1.1l-2.7-3.6\n' +
            '                            c-0.4-0.6-1.1-0.9-1.8-0.9c-0.7,0-1.4,0.3-1.8,0.9l-2.8,3.7l-0.4-0.4c-0.5-0.5-1.1-0.7-1.8-0.7c-0.7,0-1.2,0.4-1.6,0.9l-3.5,4.6\n' +
            '                            c-0.1,0.1-0.1,0.3-0.1,0.5H2.3c-0.4,0-0.8-0.3-0.8-0.8V2.3c0-0.4,0.3-0.8,0.8-0.8h19.5c0.4,0,0.8,0.3,0.8,0.8V16.5z"></path>\n' +
            '                               <g id="Oval_32_2_">\n' +
            '                               <path d="M6.4,9C4.9,9,3.8,7.8,3.8,6.4s1.2-2.6,2.6-2.6S9,4.9,9,6.4S7.8,9,6.4,9z M6.4,5.3c-0.6,0-1.1,0.5-1.1,1.1\n' +
            '                               s0.5,1.1,1.1,1.1S7.5,7,7.5,6.4S7,5.3,6.4,5.3z"></path>\n' +
            '                               </g>\n' +
            '                               <g id="Shape_128_4_">\n' +
            '                               <path class="st0" d="M23.3,17.3"></path>\n' +
            '                               </g>\n' +
            '                               <g id="Shape_128_3_">\n' +
            '                               <path class="st0" d="M0.8,17.3"></path>\n' +
            '                               </g>\n' +
            '                            </g>\n' +
            '                            </g>\n' +
            '                            </svg><span>Photo</span>\n' +
            '                          </button>\n' +
            '                          <button class="btn btn-white" data-add-wireframe="photo-caption">\n' +
            '                            <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 22" style="enable-background:new 0 0 24 22;" xml:space="preserve">\n' +
            '                            <g id="Images-Photography__x2F__Pictures__x2F__picture-landscape_1_">\n' +
            '                            <g id="Group_32_1_">\n' +
            '                            <g id="picture-landscape_1_">\n' +
            '                            <path d="M21.8,0H2.3C1,0,0,1,0,2.3v14.3c0,1.2,1,2.3,2.3,2.3h19.5c1.2,0,2.3-1,2.3-2.3V2.3C24,1,23,0,21.8,0z M22.5,16.5\n' +
            '                            c0,0.4-0.3,0.8-0.8,0.8H6.2l3.1-4.2c0.1-0.2,0.3-0.3,0.5-0.3c0.2,0,0.4,0.1,0.6,0.2l1,1c0.2,0.2,0.4,0.2,0.6,0.2\n' +
            '                            c0.2,0,0.4-0.1,0.5-0.3l3.3-4.4c0.3-0.4,0.9-0.4,1.2,0l2.7,3.6c0.2,0.3,0.7,0.4,1,0.1c0.3-0.2,0.4-0.7,0.1-1.1l-2.7-3.6\n' +
            '                            c-0.4-0.6-1.1-0.9-1.8-0.9s-1.4,0.3-1.8,0.9l-2.8,3.7l-0.4-0.4c-0.5-0.5-1.1-0.7-1.8-0.7c-0.7,0-1.2,0.4-1.6,0.9l-3.5,4.6\n' +
            '                            c-0.1,0.1-0.1,0.3-0.1,0.5H2.3c-0.4,0-0.8-0.3-0.8-0.8V2.3c0-0.4,0.3-0.8,0.8-0.8h19.5c0.4,0,0.8,0.3,0.8,0.8V16.5z"></path>\n' +
            '                               <g id="Oval_32_1_">\n' +
            '                               <path d="M6.4,9C4.9,9,3.8,7.8,3.8,6.4s1.2-2.6,2.6-2.6S9,4.9,9,6.4S7.8,9,6.4,9z M6.4,5.3c-0.6,0-1.1,0.5-1.1,1.1\n' +
            '                               s0.5,1.1,1.1,1.1S7.5,7,7.5,6.4S7,5.3,6.4,5.3z"></path>\n' +
            '                               </g>\n' +
            '                               <g id="Shape_128_1_">\n' +
            '                               <path d="M13.3,22H0.8C0.3,22,0,21.7,0,21.3s0.3-0.8,0.8-0.8h12.5c0.4,0,0.8,0.3,0.8,0.8S13.7,22,13.3,22z"></path>\n' +
            '                               </g>\n' +
            '                            </g>\n' +
            '                            </g>\n' +
            '                            </g>\n' +
            '                            </svg><span>Photo + caption</span>\n' +
            '                          </button>\n' +
            '                          <button class="btn btn-white" data-add-wireframe="video">\n' +
            '                            <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 18.8" style="enable-background:new 0 0 24 18.8;" xml:space="preserve">\n' +
            '                            <g id="Video-Movies-TV__x2F__Video-Players__x2F__video-player-smartphone-horizontal">\n' +
            '                            <g id="Group_51">\n' +
            '                            <g id="video-player-smartphone-horizontal">\n' +
            '                            <g id="Shape_258">\n' +
            '                            <path d="M9.7,13.5c-0.3,0-0.6-0.1-0.9-0.2c-0.5-0.3-0.9-0.9-0.9-1.5V7c0-0.6,0.3-1.2,0.9-1.5c0.5-0.3,1.1-0.3,1.7-0.1\n' +
            '                            c0,0,0,0,0,0l4.5,2.1c0.7,0.3,1.2,1,1.2,1.8s-0.5,1.5-1.2,1.8l-4.5,2.1C10.2,13.4,9.9,13.5,9.7,13.5z M9.7,6.8\n' +
            '                               c-0.1,0-0.1,0-0.2,0C9.4,6.8,9.4,6.9,9.4,7v4.8c0,0.1,0,0.1,0.1,0.2C9.6,12,9.7,12,9.8,12l4.5-2.1c0.2-0.1,0.3-0.3,0.3-0.5\n' +
            '                            S14.5,9,14.3,8.9L9.8,6.8C9.8,6.8,9.7,6.8,9.7,6.8z"></path>\n' +
            '                               </g>\n' +
            '                               <g id="Rectangle-path_35">\n' +
            '                               <path d="M20.3,18.8H3.8C1.7,18.8,0,17.1,0,15V3.8C0,1.7,1.7,0,3.8,0h16.5C22.3,0,24,1.7,24,3.8V15C24,17.1,22.3,18.8,20.3,18.8z\n' +
            '                               M3.8,1.5c-1.2,0-2.3,1-2.3,2.3V15c0,1.2,1,2.3,2.3,2.3h16.5c1.2,0,2.3-1,2.3-2.3V3.8c0-1.2-1-2.3-2.3-2.3H3.8z"></path>\n' +
            '                               </g>\n' +
            '                            </g>\n' +
            '                            </g>\n' +
            '                            </g>\n' +
            '                            </svg><span>Video</span>\n' +
            '                          </button>\n' +
            '                          <button class="btn btn-white" data-add-wireframe="divider">\n' +
            '                            <svg version="1.1" id="Isolation_Mode" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24.2" style="enable-background:new 0 0 24 24.2;" xml:space="preserve">\n' +
            '                            <g id="picture-landscape_3_">\n' +
            '                            <g id="Shape_128_2_">\n' +
            '                            <path d="M23.3,12.9H0.8c-0.4,0-0.8-0.3-0.8-0.8s0.3-0.8,0.8-0.8h22.5c0.4,0,0.8,0.3,0.8,0.8S23.7,12.9,23.3,12.9z"></path>\n' +
            '                            </g>\n' +
            '                            <g>\n' +
            '                            <path d="M22.5,7.1c0,0.4-0.3,0.8-0.8,0.8H2.3c-0.4,0-0.8-0.3-0.8-0.8V0.7C1.5,0.3,1.2,0,0.8,0h0C0.3,0,0,0.3,0,0.7v6.4\n' +
            '                            c0,1.2,1,2.3,2.3,2.3h19.5c1.2,0,2.3-1,2.3-2.3V0.7C24,0.3,23.7,0,23.3,0l0,0c-0.4,0-0.8,0.3-0.8,0.7V7.1z"></path>\n' +
            '                               </g>\n' +
            '                               <g>\n' +
            '                               <path d="M1.5,17.1c0-0.4,0.3-0.8,0.8-0.8h19.5c0.4,0,0.8,0.3,0.8,0.8v6.4c0,0.4,0.3,0.7,0.8,0.7l0,0c0.4,0,0.8-0.3,0.8-0.7v-6.4\n' +
            '                               c0-1.2-1-2.2-2.3-2.2H2.3c-1.2,0-2.3,1-2.3,2.2l0,6.4c0,0.4,0.3,0.7,0.7,0.7h0c0.4,0,0.7-0.3,0.7-0.7V17.1z"></path>\n' +
            '                               </g>\n' +
            '                            </g>\n' +
            '                            </svg><span>Divider</span>\n' +
            '                          </button>\n' +
            '                          <button class="btn btn-white" data-add-wireframe="quotes">\n' +
            '                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 21.3 15.3" style="enable-background:new 0 0 21.3 15.3;" xml:space="preserve">\n' +
            '                            <path d="M5.4,5c0.1-0.2,0.2-0.4,0.4-0.7C6.6,3.2,8,2.1,9.9,1.2c0.3-0.2,0.4-0.5,0.3-0.7C10.1,0.2,9.9,0,9.5,0\n' +
            '                            c-4,0.5-6.8,2.2-8.3,5.1c-0.5,1-0.9,2-1.1,3.2C0,9,0,9.5,0,10.1c0,2.8,2.3,5.1,5.1,5.1s5.1-2.3,5.1-5.1C10.3,7.4,8.1,5.1,5.4,5z\n' +
            '                            M4.2,5.8C4.3,6,4.6,6.3,5.1,6.3C7.3,6.3,9,8,9,10.1S7.3,14,5.1,14s-3.9-1.7-3.9-3.9c0-0.5,0-1,0.1-1.7c0.2-1,0.5-1.9,0.9-2.8\n' +
            '                            C3.4,3.8,5,2.7,6,2.3C5.5,2.7,5.1,3.1,4.8,3.6C4.2,4.4,4,5.3,4.2,5.8z"></path>\n' +
            '                            <path d="M16.4,5c0.1-0.3,0.2-0.4,0.4-0.7c0.8-1.1,2.3-2.2,4.1-3.1c0.3-0.2,0.4-0.5,0.3-0.7C21.1,0.2,20.9,0,20.5,0\n' +
            '                            c-4,0.5-6.8,2.2-8.3,5.1c-0.5,1-0.9,2-1.1,3.2C11,9,11,9.5,11,10.1c0,2.8,2.3,5.1,5.1,5.1s5.1-2.3,5.1-5.1C21.3,7.4,19.1,5.1,16.4,5\n' +
            '                            z M15.2,5.8c0.1,0.2,0.4,0.5,0.9,0.5c2.1,0,3.9,1.7,3.9,3.9S18.3,14,16.1,14s-3.9-1.7-3.9-3.9c0-0.5,0-1,0.1-1.7\n' +
            '                            c0.2-1,0.5-1.9,0.9-2.8c1-1.9,2.7-2.9,3.6-3.4c-0.5,0.4-0.9,0.9-1.2,1.3C15.2,4.4,15,5.3,15.2,5.8z"></path>\n' +
            '                            </svg><span>Quotes</span>\n' +
            '                          </button>\n' +
            '                        </div>\n' +
            '                        <div class="add-cont__opt">\n' +
            '                          <button class="btn btn-white hide" data-hide-btns="data-hide-btns">\n' +
            '                            <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">\n' +
            '                            <g id="Interface-Essential__x2F__Form-Validation__x2F__check-circle-1">\n' +
            '                            <g id="Group_389">\n' +
            '                            <g id="check-circle-1">\n' +
            '                            <g id="Shape_1754">\n' +
            '                            <path d="M9.3,17.9C9.3,17.9,9.3,17.9,9.3,17.9c-0.6,0-1.2-0.3-1.5-0.8l-2.4-3.5c-0.2-0.3-0.2-0.8,0.2-1c0.3-0.2,0.8-0.2,1,0.2\n' +
            '                            l2.5,3.5c0.1,0.1,0.2,0.1,0.2,0.1c0.1,0,0.2,0,0.2-0.1l7.9-9.9C17.7,6,18.1,6,18.5,6.2c0.3,0.3,0.4,0.7,0.1,1.1l-7.8,9.9\n' +
            '                            C10.4,17.7,9.9,17.9,9.3,17.9z"></path>\n' +
            '                               </g>\n' +
            '                               <g id="Oval_227">\n' +
            '                               <path d="M12,24C5.4,24,0,18.6,0,12S5.4,0,12,0s12,5.4,12,12S18.6,24,12,24z M12,1.5C6.2,1.5,1.5,6.2,1.5,12S6.2,22.5,12,22.5\n' +
            '                               S22.5,17.8,22.5,12S17.8,1.5,12,1.5z"></path>\n' +
            '                               </g>\n' +
            '                            </g>\n' +
            '                            </g>\n' +
            '                            </g>\n' +
            '                            </svg><span>Hide</span>\n' +
            '                          </button>\n' +
            '                        </div>\n' +
            '                      </div>\n' +
            '                    </div>',
            text_block = '<div class="wireframe wireframe_draggable">\n' +
                    add_block+
                '    <div class="wireframe__cont">\n' +
                '      <div class="wireframe__top">\n' +
                '        <button class="wireframe__btn" data-tooltip="Move up" data-wireframe-up="data-wireframe-up">\n' +
                '          <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.5 13.9" style="enable-background:new 0 0 25.5 13.9;" xml:space="preserve">\n' +
                '          <g id="Arrows-Diagrams__x2F__Arrows__x2F__arrow-up-1">\n' +
                '              <g id="Group_128">\n' +
                '                  <g id="Regular_128">\n' +
                '                      <g id="Shape_351">\n' +
                '                          <path d="M24,13.9c-0.4,0-0.8-0.1-1.1-0.4L12.8,3.3L2.6,13.5c-0.6,0.6-1.5,0.6-2.1,0s-0.6-1.5,0-2.1L11.2,0.7\n' +
                '                              c0.8-0.8,2.3-0.8,3.2,0l10.7,10.7c0.6,0.6,0.6,1.5,0,2.1C24.8,13.8,24.4,13.9,24,13.9z"></path>\n' +
                '                      </g>\n' +
                '                  </g>\n' +
                '              </g>\n' +
                '          </g>\n' +
                '          </svg>\n' +
                '        </button>\n' +
                '        <button class="wireframe__btn" data-tooltip="Move down" data-wireframe-down="data-wireframe-down">\n' +
                '          <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.5 13.9" style="enable-background:new 0 0 25.5 13.9;" xml:space="preserve">\n' +
                '          <g id="Arrows-Diagrams__x2F__Arrows__x2F__arrow-down-1">\n' +
                '              <g id="Group_51">\n' +
                '                  <g id="Regular_51">\n' +
                '                      <g id="Shape_225">\n' +
                '                          <path d="M12.8,13.9c-0.6,0-1.2-0.2-1.6-0.7L0.4,2.6C-0.1,2-0.1,1,0.4,0.4C1-0.1,2-0.1,2.6,0.4l10.2,10.2L22.9,0.4\n' +
                '                              c0.6-0.6,1.5-0.6,2.1,0c0.6,0.6,0.6,1.5,0,2.1L14.3,13.3C13.9,13.7,13.3,13.9,12.8,13.9z M12.2,11.2\n' +
                '                              C12.2,11.2,12.2,11.2,12.2,11.2L12.2,11.2z M13.3,11.2L13.3,11.2C13.3,11.2,13.3,11.2,13.3,11.2z"></path>\n' +
                '                      </g>\n' +
                '                  </g>\n' +
                '              </g>\n' +
                '          </g>\n' +
                '          </svg>\n' +
                '        </button>\n' +
                '        <div class="wireframe-options">\n' +
                '          <button class="wireframe__btn" data-tooltip="Options" data-drop-trig="data-drop-trig">\n' +
                '            <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 6.8" style="enable-background:new 0 0 24 6.8;" xml:space="preserve">\n' +
                '            <g id="Interface-Essential__x2F__Menu__x2F__navigation-menu-horizontal">\n' +
                '                <g id="Group_27">\n' +
                '                    <g id="navigation-menu-horizontal">\n' +
                '                        <g id="Oval_12">\n' +
                '                            <path d="M3.4,6.7C1.5,6.7,0,5.2,0,3.4S1.5,0,3.4,0s3.4,1.5,3.4,3.4S5.2,6.7,3.4,6.7z M3.4,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                s0.8,1.9,1.9,1.9s1.9-0.8,1.9-1.9S4.4,1.5,3.4,1.5z"></path>\n' +
                '                        </g>\n' +
                '                        <g id="Oval_13">\n' +
                '                            <path d="M20.6,6.7c-1.9,0-3.4-1.5-3.4-3.4S18.8,0,20.6,0S24,1.5,24,3.4S22.5,6.7,20.6,6.7z M20.6,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                s0.8,1.9,1.9,1.9s1.9-0.8,1.9-1.9S21.7,1.5,20.6,1.5z"></path>\n' +
                '                        </g>\n' +
                '                        <g id="Oval_14">\n' +
                '                            <path d="M12,6.7c-1.9,0-3.4-1.5-3.4-3.4S10.1,0,12,0s3.4,1.5,3.4,3.4S13.9,6.7,12,6.7z M12,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                S11,5.2,12,5.2s1.9-0.8,1.9-1.9S13,1.5,12,1.5z"></path>\n' +
                '                        </g>\n' +
                '                    </g>\n' +
                '                </g>\n' +
                '            </g>\n' +
                '            </svg>\n' +
                '          </button>\n' +
                '          <ul class="wireframe-options__list" data-drop="data-drop">\n' +
                '            <li><a class="red" href="javascript:;" data-del-sec="data-del-sec">Delete section</a></li>\n' +
                '          </ul>\n' +
                '        </div>\n' +
                '      </div>\n' +
                '      <textarea class="post-constructor__textarea post-constructor__textarea_i" placeholder="Type your text" style="overflow: hidden; overflow-wrap: break-word; height: 28px;"></textarea>\n' +
                '    </div>\n' +
                '  </div>',
            photo_block = '<div class="wireframe wireframe_draggable">\n' +
                    add_block +
                '    <div class="wireframe__cont">\n' +
                '      <div class="wireframe__top">\n' +
                '        <button class="wireframe__btn" data-tooltip="Move up" data-wireframe-up="data-wireframe-up">\n' +
                '          <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.5 13.9" style="enable-background:new 0 0 25.5 13.9;" xml:space="preserve">\n' +
                '          <g id="Arrows-Diagrams__x2F__Arrows__x2F__arrow-up-1">\n' +
                '              <g id="Group_128">\n' +
                '                  <g id="Regular_128">\n' +
                '                      <g id="Shape_351">\n' +
                '                          <path d="M24,13.9c-0.4,0-0.8-0.1-1.1-0.4L12.8,3.3L2.6,13.5c-0.6,0.6-1.5,0.6-2.1,0s-0.6-1.5,0-2.1L11.2,0.7\n' +
                '                              c0.8-0.8,2.3-0.8,3.2,0l10.7,10.7c0.6,0.6,0.6,1.5,0,2.1C24.8,13.8,24.4,13.9,24,13.9z"></path>\n' +
                '                      </g>\n' +
                '                  </g>\n' +
                '              </g>\n' +
                '          </g>\n' +
                '          </svg>\n' +
                '        </button>\n' +
                '        <button class="wireframe__btn" data-tooltip="Move down" data-wireframe-down="data-wireframe-down">\n' +
                '          <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.5 13.9" style="enable-background:new 0 0 25.5 13.9;" xml:space="preserve">\n' +
                '          <g id="Arrows-Diagrams__x2F__Arrows__x2F__arrow-down-1">\n' +
                '              <g id="Group_51">\n' +
                '                  <g id="Regular_51">\n' +
                '                      <g id="Shape_225">\n' +
                '                          <path d="M12.8,13.9c-0.6,0-1.2-0.2-1.6-0.7L0.4,2.6C-0.1,2-0.1,1,0.4,0.4C1-0.1,2-0.1,2.6,0.4l10.2,10.2L22.9,0.4\n' +
                '                              c0.6-0.6,1.5-0.6,2.1,0c0.6,0.6,0.6,1.5,0,2.1L14.3,13.3C13.9,13.7,13.3,13.9,12.8,13.9z M12.2,11.2\n' +
                '                              C12.2,11.2,12.2,11.2,12.2,11.2L12.2,11.2z M13.3,11.2L13.3,11.2C13.3,11.2,13.3,11.2,13.3,11.2z"></path>\n' +
                '                      </g>\n' +
                '                  </g>\n' +
                '              </g>\n' +
                '          </g>\n' +
                '          </svg>\n' +
                '        </button>\n' +
                '        <div class="wireframe-options">\n' +
                '          <button class="wireframe__btn" data-tooltip="Options" data-drop-trig="data-drop-trig">\n' +
                '            <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 6.8" style="enable-background:new 0 0 24 6.8;" xml:space="preserve">\n' +
                '            <g id="Interface-Essential__x2F__Menu__x2F__navigation-menu-horizontal">\n' +
                '                <g id="Group_27">\n' +
                '                    <g id="navigation-menu-horizontal">\n' +
                '                        <g id="Oval_12">\n' +
                '                            <path d="M3.4,6.7C1.5,6.7,0,5.2,0,3.4S1.5,0,3.4,0s3.4,1.5,3.4,3.4S5.2,6.7,3.4,6.7z M3.4,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                s0.8,1.9,1.9,1.9s1.9-0.8,1.9-1.9S4.4,1.5,3.4,1.5z"></path>\n' +
                '                        </g>\n' +
                '                        <g id="Oval_13">\n' +
                '                            <path d="M20.6,6.7c-1.9,0-3.4-1.5-3.4-3.4S18.8,0,20.6,0S24,1.5,24,3.4S22.5,6.7,20.6,6.7z M20.6,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                s0.8,1.9,1.9,1.9s1.9-0.8,1.9-1.9S21.7,1.5,20.6,1.5z"></path>\n' +
                '                        </g>\n' +
                '                        <g id="Oval_14">\n' +
                '                            <path d="M12,6.7c-1.9,0-3.4-1.5-3.4-3.4S10.1,0,12,0s3.4,1.5,3.4,3.4S13.9,6.7,12,6.7z M12,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                S11,5.2,12,5.2s1.9-0.8,1.9-1.9S13,1.5,12,1.5z"></path>\n' +
                '                        </g>\n' +
                '                    </g>\n' +
                '                </g>\n' +
                '            </g>\n' +
                '            </svg>\n' +
                '          </button>\n' +
                '          <ul class="wireframe-options__list" data-drop="data-drop">\n' +
                '            <li><a href="#">Add caption</a></li>\n' +
                '            <li><a href="javascript:;" data-change-photo="data-change-photo">Change photo</a></li>\n' +
                '            <li><a class="red" href="javascript:;" data-del-sec="data-del-sec">Delete section</a></li>\n' +
                '          </ul>\n' +
                '        </div>\n' +
                '      </div>\n' +
                '      <label class="btn-add-file btn-add-file_lg">\n' +
                '        <input class="btn-add-file__input hidden" type="file" data-img-upload="data-img-upload">\n' +
                '        <div class="btn-add-file__preview hidden"><img src="#" alt="image"></div>\n' +
                '        <div class="btn-add-file__cont"><img src="assets/img/icons/plus-40.png" alt="plus"><span class="btn-add-file__title">Add journal photo</span><span class="btn-add-file__desc">Min 700 x 500 px</span><a class="btn-add-file__link" href="#">Or Choose From Library</a></div>\n' +
                '      </label>\n' +
                '    </div>\n' +
                '  </div>',
            photoCaption_block = '<div class="wireframe wireframe_draggable">\n' +
                    add_block +
                '    <div class="wireframe__cont">\n' +
                '      <div class="wireframe__top">\n' +
                '        <button class="wireframe__btn" data-tooltip="Move up" data-wireframe-up="data-wireframe-up">\n' +
                '          <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.5 13.9" style="enable-background:new 0 0 25.5 13.9;" xml:space="preserve">\n' +
                '          <g id="Arrows-Diagrams__x2F__Arrows__x2F__arrow-up-1">\n' +
                '              <g id="Group_128">\n' +
                '                  <g id="Regular_128">\n' +
                '                      <g id="Shape_351">\n' +
                '                          <path d="M24,13.9c-0.4,0-0.8-0.1-1.1-0.4L12.8,3.3L2.6,13.5c-0.6,0.6-1.5,0.6-2.1,0s-0.6-1.5,0-2.1L11.2,0.7\n' +
                '                              c0.8-0.8,2.3-0.8,3.2,0l10.7,10.7c0.6,0.6,0.6,1.5,0,2.1C24.8,13.8,24.4,13.9,24,13.9z"></path>\n' +
                '                      </g>\n' +
                '                  </g>\n' +
                '              </g>\n' +
                '          </g>\n' +
                '          </svg>\n' +
                '        </button>\n' +
                '        <button class="wireframe__btn" data-tooltip="Move down" data-wireframe-down="data-wireframe-down">\n' +
                '          <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.5 13.9" style="enable-background:new 0 0 25.5 13.9;" xml:space="preserve">\n' +
                '          <g id="Arrows-Diagrams__x2F__Arrows__x2F__arrow-down-1">\n' +
                '              <g id="Group_51">\n' +
                '                  <g id="Regular_51">\n' +
                '                      <g id="Shape_225">\n' +
                '                          <path d="M12.8,13.9c-0.6,0-1.2-0.2-1.6-0.7L0.4,2.6C-0.1,2-0.1,1,0.4,0.4C1-0.1,2-0.1,2.6,0.4l10.2,10.2L22.9,0.4\n' +
                '                              c0.6-0.6,1.5-0.6,2.1,0c0.6,0.6,0.6,1.5,0,2.1L14.3,13.3C13.9,13.7,13.3,13.9,12.8,13.9z M12.2,11.2\n' +
                '                              C12.2,11.2,12.2,11.2,12.2,11.2L12.2,11.2z M13.3,11.2L13.3,11.2C13.3,11.2,13.3,11.2,13.3,11.2z"></path>\n' +
                '                      </g>\n' +
                '                  </g>\n' +
                '              </g>\n' +
                '          </g>\n' +
                '          </svg>\n' +
                '        </button>\n' +
                '        <div class="wireframe-options">\n' +
                '          <button class="wireframe__btn" data-tooltip="Options" data-drop-trig="data-drop-trig">\n' +
                '            <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 6.8" style="enable-background:new 0 0 24 6.8;" xml:space="preserve">\n' +
                '            <g id="Interface-Essential__x2F__Menu__x2F__navigation-menu-horizontal">\n' +
                '                <g id="Group_27">\n' +
                '                    <g id="navigation-menu-horizontal">\n' +
                '                        <g id="Oval_12">\n' +
                '                            <path d="M3.4,6.7C1.5,6.7,0,5.2,0,3.4S1.5,0,3.4,0s3.4,1.5,3.4,3.4S5.2,6.7,3.4,6.7z M3.4,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                s0.8,1.9,1.9,1.9s1.9-0.8,1.9-1.9S4.4,1.5,3.4,1.5z"></path>\n' +
                '                        </g>\n' +
                '                        <g id="Oval_13">\n' +
                '                            <path d="M20.6,6.7c-1.9,0-3.4-1.5-3.4-3.4S18.8,0,20.6,0S24,1.5,24,3.4S22.5,6.7,20.6,6.7z M20.6,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                s0.8,1.9,1.9,1.9s1.9-0.8,1.9-1.9S21.7,1.5,20.6,1.5z"></path>\n' +
                '                        </g>\n' +
                '                        <g id="Oval_14">\n' +
                '                            <path d="M12,6.7c-1.9,0-3.4-1.5-3.4-3.4S10.1,0,12,0s3.4,1.5,3.4,3.4S13.9,6.7,12,6.7z M12,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                S11,5.2,12,5.2s1.9-0.8,1.9-1.9S13,1.5,12,1.5z"></path>\n' +
                '                        </g>\n' +
                '                    </g>\n' +
                '                </g>\n' +
                '            </g>\n' +
                '            </svg>\n' +
                '          </button>\n' +
                '          <ul class="wireframe-options__list" data-drop="data-drop">\n' +
                '            <li><a href="javascript:;" data-add-photo-caption="data-add-photo-caption" draggable="false" class="hidden">Add caption</a><a class="" href="javascript:;" data-rm-photo-caption="data-rm-photo-caption" draggable="false">Remove caption</a></li>\n' +
                '            <li><a href="javascript:;" data-change-photo="data-change-photo" draggable="false">Change photo</a></li>\n' +
                '            <li><a class="red" href="javascript:;" data-del-sec="data-del-sec" draggable="false">Delete section</a></li>\n' +
                '          </ul>\n' +
                '        </div>\n' +
                '      </div>\n' +
                '      <label class="btn-add-file btn-add-file_lg">\n' +
                '        <input class="btn-add-file__input hidden" type="file" data-img-upload="data-img-upload">\n' +
                '        <div class="btn-add-file__preview hidden"><img src="#" alt="image" draggable="false"></div>\n' +
                '        <div class="btn-add-file__cont"><img src="assets/img/icons/plus-40.png" alt="plus" draggable="false"><span class="btn-add-file__title">Add journal photo</span><span class="btn-add-file__desc">Min 700 x 500 px</span><a class="btn-add-file__link" href="#" draggable="false">Or Choose From Library</a></div>\n' +
                '      </label>\n' +
                '      <textarea class="post-constructor__textarea post-constructor__textarea_i post-constructor__textarea_author hidden" placeholder="Caption" style="overflow: hidden; overflow-wrap: break-word; display: inline-block;"></textarea>\n' +
                '    </div>\n' +
                '  </div>',
            video_block = '<div class="wireframe wireframe_draggable">\n' +
                    add_block +
                '    <div class="wireframe__cont">\n' +
                '      <div class="wireframe__top">\n' +
                '        <button class="wireframe__btn" data-tooltip="Move up" data-wireframe-up="data-wireframe-up">\n' +
                '          <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.5 13.9" style="enable-background:new 0 0 25.5 13.9;" xml:space="preserve">\n' +
                '          <g id="Arrows-Diagrams__x2F__Arrows__x2F__arrow-up-1">\n' +
                '              <g id="Group_128">\n' +
                '                  <g id="Regular_128">\n' +
                '                      <g id="Shape_351">\n' +
                '                          <path d="M24,13.9c-0.4,0-0.8-0.1-1.1-0.4L12.8,3.3L2.6,13.5c-0.6,0.6-1.5,0.6-2.1,0s-0.6-1.5,0-2.1L11.2,0.7\n' +
                '                              c0.8-0.8,2.3-0.8,3.2,0l10.7,10.7c0.6,0.6,0.6,1.5,0,2.1C24.8,13.8,24.4,13.9,24,13.9z"></path>\n' +
                '                      </g>\n' +
                '                  </g>\n' +
                '              </g>\n' +
                '          </g>\n' +
                '          </svg>\n' +
                '        </button>\n' +
                '        <button class="wireframe__btn" data-tooltip="Move down" data-wireframe-down="data-wireframe-down">\n' +
                '          <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.5 13.9" style="enable-background:new 0 0 25.5 13.9;" xml:space="preserve">\n' +
                '          <g id="Arrows-Diagrams__x2F__Arrows__x2F__arrow-down-1">\n' +
                '              <g id="Group_51">\n' +
                '                  <g id="Regular_51">\n' +
                '                      <g id="Shape_225">\n' +
                '                          <path d="M12.8,13.9c-0.6,0-1.2-0.2-1.6-0.7L0.4,2.6C-0.1,2-0.1,1,0.4,0.4C1-0.1,2-0.1,2.6,0.4l10.2,10.2L22.9,0.4\n' +
                '                              c0.6-0.6,1.5-0.6,2.1,0c0.6,0.6,0.6,1.5,0,2.1L14.3,13.3C13.9,13.7,13.3,13.9,12.8,13.9z M12.2,11.2\n' +
                '                              C12.2,11.2,12.2,11.2,12.2,11.2L12.2,11.2z M13.3,11.2L13.3,11.2C13.3,11.2,13.3,11.2,13.3,11.2z"></path>\n' +
                '                      </g>\n' +
                '                  </g>\n' +
                '              </g>\n' +
                '          </g>\n' +
                '          </svg>\n' +
                '        </button>\n' +
                '        <div class="wireframe-options">\n' +
                '          <button class="wireframe__btn" data-tooltip="Options" data-drop-trig="data-drop-trig">\n' +
                '            <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 6.8" style="enable-background:new 0 0 24 6.8;" xml:space="preserve">\n' +
                '            <g id="Interface-Essential__x2F__Menu__x2F__navigation-menu-horizontal">\n' +
                '                <g id="Group_27">\n' +
                '                    <g id="navigation-menu-horizontal">\n' +
                '                        <g id="Oval_12">\n' +
                '                            <path d="M3.4,6.7C1.5,6.7,0,5.2,0,3.4S1.5,0,3.4,0s3.4,1.5,3.4,3.4S5.2,6.7,3.4,6.7z M3.4,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                s0.8,1.9,1.9,1.9s1.9-0.8,1.9-1.9S4.4,1.5,3.4,1.5z"></path>\n' +
                '                        </g>\n' +
                '                        <g id="Oval_13">\n' +
                '                            <path d="M20.6,6.7c-1.9,0-3.4-1.5-3.4-3.4S18.8,0,20.6,0S24,1.5,24,3.4S22.5,6.7,20.6,6.7z M20.6,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                s0.8,1.9,1.9,1.9s1.9-0.8,1.9-1.9S21.7,1.5,20.6,1.5z"></path>\n' +
                '                        </g>\n' +
                '                        <g id="Oval_14">\n' +
                '                            <path d="M12,6.7c-1.9,0-3.4-1.5-3.4-3.4S10.1,0,12,0s3.4,1.5,3.4,3.4S13.9,6.7,12,6.7z M12,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                S11,5.2,12,5.2s1.9-0.8,1.9-1.9S13,1.5,12,1.5z"></path>\n' +
                '                        </g>\n' +
                '                    </g>\n' +
                '                </g>\n' +
                '            </g>\n' +
                '            </svg>\n' +
                '          </button>\n' +
                '          <ul class="wireframe-options__list" data-drop="data-drop">\n' +
                '            <li><a href="#">Switch Video</a></li>\n' +
                '            <li><a class="red" href="javascript:;" data-del-sec="data-del-sec">Delete section</a></li>\n' +
                '          </ul>\n' +
                '        </div>\n' +
                '      </div>\n' +
                '      <label class="btn-add-file btn-add-file_lg">\n' +
                '        <div class="btn-add-file__cont"><img src="assets/img/icons/plus-40.png" alt="plus"><span class="btn-add-file__title">Add journal video</span><a class="btn-add-file__link" href="#">Or Choose From Library</a></div>\n' +
                '      </label>\n' +
                '    </div>\n' +
                '  </div>',
            divider_block = '<div class="wireframe wireframe_draggable">\n' +
                    add_block +
                '    <div class="wireframe__cont">\n' +
                '      <div class="wireframe__top">\n' +
                '        <button class="wireframe__btn" data-tooltip="Move up" data-wireframe-up="data-wireframe-up">\n' +
                '          <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.5 13.9" style="enable-background:new 0 0 25.5 13.9;" xml:space="preserve">\n' +
                '          <g id="Arrows-Diagrams__x2F__Arrows__x2F__arrow-up-1">\n' +
                '              <g id="Group_128">\n' +
                '                  <g id="Regular_128">\n' +
                '                      <g id="Shape_351">\n' +
                '                          <path d="M24,13.9c-0.4,0-0.8-0.1-1.1-0.4L12.8,3.3L2.6,13.5c-0.6,0.6-1.5,0.6-2.1,0s-0.6-1.5,0-2.1L11.2,0.7\n' +
                '                              c0.8-0.8,2.3-0.8,3.2,0l10.7,10.7c0.6,0.6,0.6,1.5,0,2.1C24.8,13.8,24.4,13.9,24,13.9z"></path>\n' +
                '                      </g>\n' +
                '                  </g>\n' +
                '              </g>\n' +
                '          </g>\n' +
                '          </svg>\n' +
                '        </button>\n' +
                '        <button class="wireframe__btn" data-tooltip="Move down" data-wireframe-down="data-wireframe-down">\n' +
                '          <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.5 13.9" style="enable-background:new 0 0 25.5 13.9;" xml:space="preserve">\n' +
                '          <g id="Arrows-Diagrams__x2F__Arrows__x2F__arrow-down-1">\n' +
                '              <g id="Group_51">\n' +
                '                  <g id="Regular_51">\n' +
                '                      <g id="Shape_225">\n' +
                '                          <path d="M12.8,13.9c-0.6,0-1.2-0.2-1.6-0.7L0.4,2.6C-0.1,2-0.1,1,0.4,0.4C1-0.1,2-0.1,2.6,0.4l10.2,10.2L22.9,0.4\n' +
                '                              c0.6-0.6,1.5-0.6,2.1,0c0.6,0.6,0.6,1.5,0,2.1L14.3,13.3C13.9,13.7,13.3,13.9,12.8,13.9z M12.2,11.2\n' +
                '                              C12.2,11.2,12.2,11.2,12.2,11.2L12.2,11.2z M13.3,11.2L13.3,11.2C13.3,11.2,13.3,11.2,13.3,11.2z"></path>\n' +
                '                      </g>\n' +
                '                  </g>\n' +
                '              </g>\n' +
                '          </g>\n' +
                '          </svg>\n' +
                '        </button>\n' +
                '        <div class="wireframe-options">\n' +
                '          <button class="wireframe__btn" data-tooltip="Options" data-drop-trig="data-drop-trig">\n' +
                '            <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 6.8" style="enable-background:new 0 0 24 6.8;" xml:space="preserve">\n' +
                '            <g id="Interface-Essential__x2F__Menu__x2F__navigation-menu-horizontal">\n' +
                '                <g id="Group_27">\n' +
                '                    <g id="navigation-menu-horizontal">\n' +
                '                        <g id="Oval_12">\n' +
                '                            <path d="M3.4,6.7C1.5,6.7,0,5.2,0,3.4S1.5,0,3.4,0s3.4,1.5,3.4,3.4S5.2,6.7,3.4,6.7z M3.4,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                s0.8,1.9,1.9,1.9s1.9-0.8,1.9-1.9S4.4,1.5,3.4,1.5z"></path>\n' +
                '                        </g>\n' +
                '                        <g id="Oval_13">\n' +
                '                            <path d="M20.6,6.7c-1.9,0-3.4-1.5-3.4-3.4S18.8,0,20.6,0S24,1.5,24,3.4S22.5,6.7,20.6,6.7z M20.6,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                s0.8,1.9,1.9,1.9s1.9-0.8,1.9-1.9S21.7,1.5,20.6,1.5z"></path>\n' +
                '                        </g>\n' +
                '                        <g id="Oval_14">\n' +
                '                            <path d="M12,6.7c-1.9,0-3.4-1.5-3.4-3.4S10.1,0,12,0s3.4,1.5,3.4,3.4S13.9,6.7,12,6.7z M12,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                S11,5.2,12,5.2s1.9-0.8,1.9-1.9S13,1.5,12,1.5z"></path>\n' +
                '                        </g>\n' +
                '                    </g>\n' +
                '                </g>\n' +
                '            </g>\n' +
                '            </svg>\n' +
                '          </button>\n' +
                '          <ul class="wireframe-options__list" data-drop="data-drop">\n' +
                '            <li><a class="red" href="javascript:;" data-del-sec="data-del-sec">Delete section</a></li>\n' +
                '          </ul>\n' +
                '        </div>\n' +
                '      </div>\n' +
                '      <div class="post-constructor__divider"></div>\n' +
                '    </div>\n' +
                '  </div>',
            quotes_block = '<div class="wireframe" draggable="false">\n' +
                    add_block +
                '    <div class="wireframe__cont">\n' +
                '      <div class="wireframe__top">\n' +
                '        <button class="wireframe__btn" data-tooltip="Move up" data-wireframe-up="data-wireframe-up">\n' +
                '          <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.5 13.9" style="enable-background:new 0 0 25.5 13.9;" xml:space="preserve">\n' +
                '          <g id="Arrows-Diagrams__x2F__Arrows__x2F__arrow-up-1">\n' +
                '              <g id="Group_128">\n' +
                '                  <g id="Regular_128">\n' +
                '                      <g id="Shape_351">\n' +
                '                          <path d="M24,13.9c-0.4,0-0.8-0.1-1.1-0.4L12.8,3.3L2.6,13.5c-0.6,0.6-1.5,0.6-2.1,0s-0.6-1.5,0-2.1L11.2,0.7\n' +
                '                              c0.8-0.8,2.3-0.8,3.2,0l10.7,10.7c0.6,0.6,0.6,1.5,0,2.1C24.8,13.8,24.4,13.9,24,13.9z"></path>\n' +
                '                      </g>\n' +
                '                  </g>\n' +
                '              </g>\n' +
                '          </g>\n' +
                '          </svg>\n' +
                '        </button>\n' +
                '        <button class="wireframe__btn" data-tooltip="Move down" data-wireframe-down="data-wireframe-down">\n' +
                '          <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.5 13.9" style="enable-background:new 0 0 25.5 13.9;" xml:space="preserve">\n' +
                '          <g id="Arrows-Diagrams__x2F__Arrows__x2F__arrow-down-1">\n' +
                '              <g id="Group_51">\n' +
                '                  <g id="Regular_51">\n' +
                '                      <g id="Shape_225">\n' +
                '                          <path d="M12.8,13.9c-0.6,0-1.2-0.2-1.6-0.7L0.4,2.6C-0.1,2-0.1,1,0.4,0.4C1-0.1,2-0.1,2.6,0.4l10.2,10.2L22.9,0.4\n' +
                '                              c0.6-0.6,1.5-0.6,2.1,0c0.6,0.6,0.6,1.5,0,2.1L14.3,13.3C13.9,13.7,13.3,13.9,12.8,13.9z M12.2,11.2\n' +
                '                              C12.2,11.2,12.2,11.2,12.2,11.2L12.2,11.2z M13.3,11.2L13.3,11.2C13.3,11.2,13.3,11.2,13.3,11.2z"></path>\n' +
                '                      </g>\n' +
                '                  </g>\n' +
                '              </g>\n' +
                '          </g>\n' +
                '          </svg>\n' +
                '        </button>\n' +
                '        <div class="wireframe-options">\n' +
                '          <button class="wireframe__btn" data-tooltip="Options" data-drop-trig="data-drop-trig">\n' +
                '            <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 6.8" style="enable-background:new 0 0 24 6.8;" xml:space="preserve">\n' +
                '            <g id="Interface-Essential__x2F__Menu__x2F__navigation-menu-horizontal">\n' +
                '                <g id="Group_27">\n' +
                '                    <g id="navigation-menu-horizontal">\n' +
                '                        <g id="Oval_12">\n' +
                '                            <path d="M3.4,6.7C1.5,6.7,0,5.2,0,3.4S1.5,0,3.4,0s3.4,1.5,3.4,3.4S5.2,6.7,3.4,6.7z M3.4,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                s0.8,1.9,1.9,1.9s1.9-0.8,1.9-1.9S4.4,1.5,3.4,1.5z"></path>\n' +
                '                        </g>\n' +
                '                        <g id="Oval_13">\n' +
                '                            <path d="M20.6,6.7c-1.9,0-3.4-1.5-3.4-3.4S18.8,0,20.6,0S24,1.5,24,3.4S22.5,6.7,20.6,6.7z M20.6,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                s0.8,1.9,1.9,1.9s1.9-0.8,1.9-1.9S21.7,1.5,20.6,1.5z"></path>\n' +
                '                        </g>\n' +
                '                        <g id="Oval_14">\n' +
                '                            <path d="M12,6.7c-1.9,0-3.4-1.5-3.4-3.4S10.1,0,12,0s3.4,1.5,3.4,3.4S13.9,6.7,12,6.7z M12,1.5c-1,0-1.9,0.8-1.9,1.9\n' +
                '                                S11,5.2,12,5.2s1.9-0.8,1.9-1.9S13,1.5,12,1.5z"></path>\n' +
                '                        </g>\n' +
                '                    </g>\n' +
                '                </g>\n' +
                '            </g>\n' +
                '            </svg>\n' +
                '          </button>\n' +
                '          <ul class="wireframe-options__list" data-drop="data-drop">\n' +
                '            <li><a href="javascript:;" data-add-cap="data-add-cap" draggable="false">Add caption</a><a class="hidden" href="javascript:;" data-rm-cap="data-rm-cap" draggable="false">Remove caption</a></li>\n' +
                '            <li><a class="red" href="javascript:;" data-del-sec="data-del-sec" draggable="false">Delete section</a></li>\n' +
                '          </ul>\n' +
                '        </div>\n' +
                '      </div>\n' +
                '      <div class="post-constructor__quote">\n' +
                '        <textarea class="post-constructor__textarea post-constructor__textarea_i post-constructor__textarea_quote" placeholder="Write quote" style="overflow: hidden; overflow-wrap: break-word; height: 28px;"></textarea>\n' +
                '        <textarea class="post-constructor__textarea post-constructor__textarea_i post-constructor__textarea_author hidden" placeholder="Author" style="overflow: hidden; overflow-wrap: break-word;"></textarea>\n' +
                '      </div>\n' +
                '    </div>\n' +
                '  </div>';

        function f_add_wireframe(block) {
            $parent.before(block);
        }

        switch (thisAttr) {
            case 'text':
                f_add_wireframe(text_block);
                break;
            case 'photo':
                f_add_wireframe(photo_block);
                break;
            case 'photo-caption':
                f_add_wireframe(photoCaption_block);
                break;
            case 'video':
                f_add_wireframe(video_block);
                break;
            case 'divider':
                f_add_wireframe(divider_block);
                break;
            case 'quotes':
                f_add_wireframe(quotes_block);
                break;
        }
    });
});