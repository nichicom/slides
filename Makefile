.DEFAULT_GOAL := help

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?# .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":[^#]*? #| #"}; {printf "%-57s%s\n", $$1 $$3, $$2}'

.PHONY: bs
bs: # Bootstrap to start development.
	@./tools/bootstrap.sh

.PHONY: doctor
doctor: # Check development environment
	@./tools/doctor.sh

# Clean
.PHONY: clean
clean: # Clean
	@bun run clean
