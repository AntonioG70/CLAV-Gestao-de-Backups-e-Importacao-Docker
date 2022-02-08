var AdmZip = require("adm-zip");
console.log(__dirname.split('routes')[0].replace(/\\/g, "/") + 'public/fileStore')
var zip = new AdmZip();

// add local file
zip.addLocalFolder(__dirname.split('routes')[0].replace(/\\/g, "/") + 'public/fileStore/bagit-1640717979954')

zip.writeZip(__dirname.split('routes')[0].replace(/\\/g, "/") + 'public/fileStore/bagit-1640717979954.zip');

/*
        <h2 class="headline font-weight-bold mb-3">
          Outros Links
        </h2>

        <v-row justify="center">
          <a
            v-for="(link, i) in importantLinks"
            :key="i"
            :href="link.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ link.text }}
          </a>
        </v-row>
      </v-col>
*/