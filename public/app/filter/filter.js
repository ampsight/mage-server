var moment = require('moment')
  , MDCDialog = require('material-components-web').dialog.MDCDialog
  , MDCSelect = require('material-components-web').select.MDCSelect
  , MDDateTimePicker = require('md-date-time-picker');

module.exports = {
  template: require('./filter.html'),
  bindings: {
    open: '<',
    events: '<',
    onFilterClose: '&'
  },
  controller: FilterController
};

FilterController.$inject = ['EventService', 'FilterService', 'Event', '$element', '$timeout'];

function FilterController(EventService, FilterService, Event, $element, $timeout) {
  var filterPanel;

  var teamSelectMdc;
  var intervalSelectMdc;
  var eventSelectMdc;
  this.teamsUpdated = true;
  this.$onChanges = function() {
    if (this.events) {
      if (this.open && this.open.opened && !filterPanel.isOpen) {
        filterPanel.open();
      }
    }

    console.log('FilterController $onChanges')
    
  }.bind(this)

  this.$onInit = function() {
    filterPanel = new MDCDialog(angular.element.find('.filter-panel')[0])
    filterPanel.listen('MDCDialog:closing', function() {
      this.onFilterClose()
    }.bind(this))
    filterPanel.listen('MDCDialog:opening', function() {
      this.filterEvent = {selected: FilterService.getEvent()};
      this.filterTeams = {selected: FilterService.getTeams()};
      this.interval = FilterService.getInterval();
    
      this.intervalChoices = FilterService.intervals;
      this.intervalChoice = FilterService.getIntervalChoice();
      this.localTime = true;
  
      if (this.interval.options && this.interval.options.startDate) {
        this.startDate = this.interval.options.startDate;
      } else {
        this.startDate = moment().startOf('day').toDate();
      }
      if (this.interval.options && this.interval.options.endDate) {
        this.endDate = this.interval.options.endDate;
      } else {
        this.endDate = moment().endOf('day').toDate();
      }
      if (!eventSelectMdc) {
        $timeout(function() {
          intervalSelectMdc = new MDCSelect($element.find('.interval-select')[0])
          intervalSelectMdc.listen('MDCSelect:change', function(event) {
            $timeout(function() {
              this.intervalChoice = this.intervalChoices.find(function(choice) {
                return choice.label === event.detail.value
              })
            }.bind(this))
          }.bind(this))

          eventSelectMdc = new MDCSelect($element.find('.event-select')[0])
          eventSelectMdc.listen('MDCSelect:change', function(event) {
            var eventId = event.detail.value;
            this.onEventChange(eventId)
          }.bind(this))

          $element.find('.js-select2').select2({
            placeholder: 'Pick things',
            theme: 'material',
            allowClear: true
          })
          $element.find('.select2-selection__arrow')
            .addClass('material-icons')
            .html('arrow_drop_down');
          
          $element.find('.js-select2').on('select2:unselecting', function(ev) {
            if (ev.params.args.originalEvent) {
              // When unselecting (in multiple mode)
              ev.params.args.originalEvent.stopPropagation();
            } else {
                // When clearing (in single mode)
              $(this).one('select2:opening', function(ev) { ev.preventDefault(); });
            }
          });

          teamSelectMdc = new MDCSelect($element.find('.team-select')[0])
          teamSelectMdc.listen('MDCSelect:change', function(event) {
            console.log('team selected', event.detail);
            if (event.detail.index === -1) return;
            $timeout(function() {
              this.filterTeams.selected.push(this.filterEvent.selected.teams.find(function(team) {
                return team.id === event.detail.value
              }))
            }.bind(this))
          }.bind(this))
        }.bind(this))
      }

      console.log('this.filterEvent', this.filterEvent)
    }.bind(this))
  }

  this.removeTeam = function(index) {
    this.filterTeams.selected.splice(index, 1);
    if (!this.filterTeams.selected.length) {
      teamSelectMdc.selectedIndex = -1;
    }
    console.log('this.filterTeams.selected', this.filterTeams.selected)
  }

  this.isTeamChosen = function(teamId) {
    return this.filterTeams.selected.find(function(team) {
      return team.id === teamId;
    })
  }

  this.onStartDate = function(date, localTime) {
    this.startDate = date;
    this.localTime = localTime;
  }

  this.onEndDate = function(date, localTime) {
    this.endDate = date;
    this.localTime = localTime;
  }

  this.onEventChange = function(eventId) {
    $timeout(function() {
      eventId = Number(eventId)
      this.filterEvent.selected = this.events.find(function(value, index) {
        return value.id === eventId;
      })
      teamSelectMdc.selectedIndex = -1;
      this.filterTeams.selected = [];
    }.bind(this))
  };

  this.performFilter = function() {
    var options = {};
    if (this.intervalChoice.filter === 'custom') {
      options.startDate = this.startDate;
      options.endDate = this.endDate;
      options.localTime = this.localTime;
    }

    FilterService.setFilter({
      event: this.filterEvent.selected,
      teams: this.filterTeams.selected,
      timeInterval: {
        choice: this.intervalChoice,
        options: options
      }
    });

  };
}
