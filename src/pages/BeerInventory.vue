<template>
  <q-page class="flex column justify-start">
    <q-table
      class="column col absolute-full"
      title="Beers"
      :data="beers"
      row-key="id"
      selection="multiple"
      :columns="columns"
      :selected.sync="selected"
      :pagination.sync="pagination"
      :filter="search"
    >
      <template v-slot:top-right>
        <q-input v-model="search" type="search" dense class="q-pr-md">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn-dropdown
          split
          icon="add"
          color="primary"
          label="Add"
          row-key="name"
          @click="addBeer"
        >
          <q-list>
            <q-item
              :clickable="selected.length > 0"
              v-close-popup
              @click="removeSelected"
            >
              <q-item-section>
                <q-icon name="delete" />
              </q-item-section>
              <q-item-section side>
                Remove selected
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td auto-width>
            <q-btn
              size="sm"
              color="secondary"
              round
              dense
              @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name">
              <q-input
                v-model="props.row.name"
                dense autofocus
                @input="update(props.row, $event)"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="volume" :props="props">
            {{ props.row.volume }} l
            <q-popup-edit v-model="props.row.volume">
              <q-input
                v-model="props.row.volume"
                type="number"
                autofocus
                @input="update(props.row, $event)"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="units" :props="props">
            {{ props.row.units }}
            <q-popup-edit v-model="props.row.units">
              <q-input
                v-model="props.row.units"
                type="number"
                autofocus
                @input="update(props.row, $event)"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="total" :props="props">
            {{ props.row.units * props.row.volume }}
          </q-td>
          <q-td key="percent" :props="props">
            {{ props.row.percent }} %
            <q-popup-edit v-model="props.row.percent">
              <q-input
                v-model="props.row.percent"
                type="number"
                autofocus
                @input="update(props.row, $event)"
              />
            </q-popup-edit>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td auto-width />
          <q-td auto-width />
          <q-td colspan="2">
            <div class="text-left">
              <span class="text-bold">Notes:</span>
              <!-- notes rendering is potentially unsafe with v-html -->
              <div v-html="props.row.notes"></div>
              <q-popup-edit v-model="props.row.notes">
                <q-editor
                  v-model="props.row.notes"
                  min-height="4rem"
                  autofocus
                  @input="update(props.row, $event)"
                  @keyup.enter.stop
                />
              </q-popup-edit>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="addDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Add beer</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            autofocuscheap
            label="Name"
            v-model="nameInputValue"
            ref="nameInput"
            :rules="[val => !!val || 'Beer must have a name']"
          />
          <q-input
            dense
            type="number"
            label="Volume"
            v-model="volumeInputValue"
            ref="volumeInput"
            :rules="[val => !!val || 'Beer must be given a volume']"
          />
          <q-input
            dense
            type="number"
            label="Units"
            v-model="unitsInputValue"
            ref="unitsInput"
            :rules="[val => !!val || 'Must have at least one unit of beer']"
          />
          <q-input
            dense
            type="number"
            label="Percent"
            v-model="percentInputValue"
            ref="percentInput"
            :rules="[val => !!val || 'Beer must be given an alcohol percent']"
          />
          <span class="text-bold">Notes</span>
          <q-editor
            v-model="notesInputValue"
            min-height="4rem"
            ref="notesInput"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            flat
            label="Add beer"
            @click="commitBeer"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Beer from '../store/models/Beer.js';

export default {
  name: 'BeerInventory',

  data() {
    return {
      addDialog: false,
      selected: [],
      nameInputValue: '',
      volumeInputValue: '',
      unitsInputValue: '',
      percentInputValue: 0,
      notesInputValue: '',
      pagination: {
        rowsPerPage: 0,
      },
      search: '',
      columns: [
        {
          name: 'name',
          label: 'Beer',
          field: (row) => row.name,
          align: 'left',
          sortable: true,
        },
        {
          name: 'volume',
          label: 'Volume',
          field: 'volume',
          align: 'right',
          sortable: true,
        },
        {
          name: 'units',
          label: 'Units',
          field: 'units',
          align: 'right',
          sortable: true,
        },
        {
          name: 'total',
          label: 'Total',
          align: 'right',
          sortable: true,
        },
        {
          name: 'percent',
          label: '%',
          field: 'percent',
          align: 'right',
          sortable: true,
        },
      ],
    };
  },

  computed: {
    beers() {
      return Beer.all();
    },
  },

  methods: {
    addBeer() {
      this.addDialog = true;
    },
    async commitBeer() {
      if (!this.formIsValid()) {
        // either the name input or the percent input did not validate
        return;
      }
      await Beer.insert({
        data: {
          name: this.$refs.nameInput.value,
          volume: this.$refs.volumeInput.value,
          units: this.$refs.unitsInput.value,
          percent: this.$refs.percentInput.value,
          notes: this.$refs.notesInput.value,
        },
      });
      this.addDialog = false;
      this.nameInputValue = '';
      this.notesInputValue = '';
      this.percentInputValue = 0;
    },
    formIsValid() {
      return (
        this.$refs.nameInput && this.$refs.percentInput
        && this.$refs.volumeInput && this.$refs.unitsInput
        && this.$refs.nameInput.validate() && this.$refs.percentInput.validate()
        && this.$refs.volumeInput.validate() && this.$refs.unitsInput.validate()
      );
    },
    removeSelected() {
      this.selected.forEach((beer) => {
        Beer.delete(beer.id);
      });
    },
    update(model) {
      model.$save();
    },
  },

  mounted() {
    Beer.insert({
      data: Beer.getStoredBeers(),
    });
  },
};
</script>
