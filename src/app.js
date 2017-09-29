var app = {
    
    presetData : {
        blank : {
            id : 'blank',
            title : 'Blank',
            at_to : 0,
            at_ag : 0,
            at_hp : 0,
            ar_hd : 0,
            ar_ra : 0,
            ar_la : 0,
            ar_bd : 0,
            ar_rl : 0,
            ar_ll : 0
        },
        human : {
            id : 'human',
            title : 'Human',
            at_to : 3,
            at_ag : 3,
            at_hp : 12,
            ar_hd : 2,
            ar_ra : 2,
            ar_la : 2,
            ar_bd : 2,
            ar_rl : 2,
            ar_ll : 2
        },
    },
    
    init : function() {
        app.setupAddNPCPreset($('#nps select[name="nps-preset"]'));

    },
    
    setupAddNPCPreset : function(element) {
        $(element).html('');
        $(element).append($('<option>', {
            value: '',
            text: ''
        }));
        jQuery.each(app.presetData, function(index, preset) {
            $(element).append($('<option>', {
                value: preset.id,
                text: preset.title
            }));
        });
        $(element).on('click', app.addNPCPreset_OnClick);
    },
    
    addNPCPreset_OnClick : function(event) {
        var selected = $(event.target).val();
        var preset = app.presetData[selected];
        $('#nps .list').append(app.template('tmpl-character', preset));
    },

    template : function(elementId, variables) {
        var source   = $('#' + elementId).html();
        var template = Handlebars.compile(source);
        return template(variables);
    }
}

$(function() {
    app.init();
});