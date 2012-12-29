NO_COLOR = \x1b[0m
GREEN = \x1b[32;01m
RED = \x1b[31;01m
YELLOW = \x1b[33;01m

BIN_SCRIPT = ./bin
TEST_DIR = ./test
TEST_MODELS = "$(TEST_DIR)/test-models.js"
TEST_USERS = "$(TEST_DIR)/users/"
TEST_API = "$(TEST_DIR)/api/"
DEMO_DIR = "$(TEST_DIR)/data"
DEMO_STORE = "$(TEST_DIR)/store"
DEMO_SIZES = "$(DEMO_DIR)/sacCer1.sizes"
DEMO_REF_FASTA = "$(DEMO_DIR)/SacCer_chrI-II-III-IV.fasta"
DEMO_GENES_JFF = "$(DEMO_DIR)/SacCer_chrI-II-III-IV.genes.jff"
DEMO_PROFILE_BIGWIG = "$(DEMO_STORE)/SRR002051_chrI-II-III-IV.profile.bw"
DEMO_ORIENTED_PROFILE_BIGWIG = "$(DEMO_STORE)/oriented"
DEMO_ORIENTED_PROFILE_BIGWIG_TOP = "$(DEMO_ORIENTED_PROFILE_BIGWIG)/SRR002051_top_chrI-II-III-IV.profile.bw"
DEMO_ORIENTED_PROFILE_BIGWIG_BOTTOM = "$(DEMO_ORIENTED_PROFILE_BIGWIG)/SRR002051_bottom_chrI-II-III-IV.profile.bw"

DEMO_DB = "SacCer-demo"
DEMO_GENE_COL = "ensembl_genes"
DEMO_USER_DB = "gstrider-users"
DEMO_USER_COL = "users"
REPORTER = "spec"


test: reinstall-demo test-all remove-demo

test-all: test-models test-users test-api

test-models:
	@NODE_ENV=test 	./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 10000 \
		--slow 1000 \
		--recursive \
		$(TEST_MODELS)

test-users:
	@NODE_ENV=test 	./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--recursive \
		$(TEST_USERS)

test-api:
	@NODE_ENV=test 	./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--recursive \
		$(TEST_API)


install-demo: unpack_demo load_reference load_annotation prepare_bigwigStore

reinstall-demo: remove-demo install-demo

unpack_demo:
	@ echo "$(YELLOW)Installing demo data$(NO_COLOR)" \
		&& echo "Unpacking demo data ..." \
		&& tar xvf $(DEMO_DIR).tar.bz2 -C $(TEST_DIR) \

load_reference:
	@ echo "$(YELLOW)Loading reference ...$(NO_COLOR)" \
		&& $(BIN_SCRIPT)/load_fasta_reference.py \
			-i $(DEMO_REF_FASTA) \
			-d $(DEMO_DB) \
			--drop \
		&& echo "$(GREEN)DONE$(NO_COLOR)"


load_annotation:
	@ echo "$(YELLOW)Loading annotation ...$(NO_COLOR)" \
		&& mongoimport \
			-d $(DEMO_DB) \
			-c $(DEMO_GENE_COL) \
			--file $(DEMO_GENES_JFF) \
			--drop \
			--stopOnError \
		&& echo "$(GREEN)DONE$(NO_COLOR)"


prepare_bigwigStore:
	@ echo "$(YELLOW)Preparing bigwig store ...$(NO_COLOR)" \
		&& mkdir $(DEMO_STORE) \
		; $(BIN_SCRIPT)/wigToBigWig \
			$(DEMO_PROFILE) \
			$(DEMO_SIZES) \
			$(DEMO_PROFILE_BIGWIG) \
		&& mkdir $(DEMO_ORIENTED_PROFILE_BIGWIG) \
		; $(BIN_SCRIPT)/wigToBigWig \
			$(DEMO_PROFILE_TOP) \
			$(DEMO_SIZES) \
			$(DEMO_ORIENTED_PROFILE_BIGWIG_TOP) \
		&& $(BIN_SCRIPT)/wigToBigWig \
			$(DEMO_PROFILE_BOTTOM) \
			$(DEMO_SIZES) \
			$(DEMO_ORIENTED_PROFILE_BIGWIG_BOTTOM) \
		&& echo "$(GREEN)DONE$(NO_COLOR)"

remove-demo:
	@ echo "$(YELLOW)Uninstalling demo data$(NO_COLOR)" \
		&& mongo $(DEMO_DB) \
			--eval "db.dropDatabase()" \
			--quiet \
		; rm -r $(DEMO_STORE) \
		; rm -r $(DEMO_DIR) \
		; echo "$(GREEN)DONE$(NO_COLOR)"



.PHONY: test test-all test-models install-demo remove-demo reinstall-demo
